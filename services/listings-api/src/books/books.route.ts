import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Queries,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import { ObjectId } from "mongodb";
import { getDb } from "../db/mongo";
import { publishBookEvent } from "../messaging/publish";

export interface FilterInput {
  from?: number;
  to?: number;
  name?: string;
  author?: string;
}

export interface Book {
  id?: string;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

function mapBook(doc: Record<string, unknown>): Book {
  return {
    id: String(doc._id ?? doc.id ?? ""),
    name: String(doc.name ?? ""),
    author: String(doc.author ?? ""),
    description: String(doc.description ?? ""),
    price: Number(doc.price ?? 0),
    image: String(doc.image ?? ""),
  };
}

function matchesFilter(book: Book, filter: FilterInput): boolean {
  if (filter.from !== undefined && book.price < filter.from) return false;
  if (filter.to !== undefined && book.price > filter.to) return false;
  if (filter.name !== undefined && !book.name.toLowerCase().includes(filter.name.toLowerCase())) {
    return false;
  }
  if (
    filter.author !== undefined &&
    !book.author.toLowerCase().includes(filter.author.toLowerCase())
  ) {
    return false;
  }
  return true;
}

@Route("books")
@Tags("Books")
export class BooksController extends Controller {
  @Get()
  public async listBooks(@Queries() query?: FilterInput): Promise<Book[]> {
    const db = await getDb();
    const docs = await db.collection("books").find({}).toArray();
    let books = docs.map((doc) => mapBook(doc as Record<string, unknown>));

    if (query && Object.keys(query).length > 0) {
      books = books.filter((book) => matchesFilter(book, query));
    }

    return books;
  }

  @Get("{id}")
  public async getBook(@Path() id: string): Promise<Book | null> {
    if (!ObjectId.isValid(id)) {
      this.setStatus(400);
      return null;
    }

    const db = await getDb();
    const book = await db.collection("books").findOne({ _id: new ObjectId(id) });

    if (!book) {
      this.setStatus(404);
      return null;
    }

    return mapBook(book as Record<string, unknown>);
  }

  @Post()
  @SuccessResponse("201", "Created")
  public async createBook(@Body() body: Book): Promise<Book> {
    const payload = {
      name: body.name,
      author: body.author,
      description: body.description,
      price: body.price,
      image: body.image,
    };

    const db = await getDb();
    const result = await db.collection("books").insertOne(payload);
    const created: Book = { ...payload, id: result.insertedId.toString() };

    await publishBookEvent({ type: "book.upserted", book: created });

    this.setStatus(201);
    return created;
  }

  @Put("{id}")
  public async updateBook(@Path() id: string, @Body() body: Book): Promise<Book | null> {
    if (!ObjectId.isValid(id)) {
      this.setStatus(400);
      return null;
    }

    const payload = {
      name: body.name,
      author: body.author,
      description: body.description,
      price: body.price,
      image: body.image,
    };

    const db = await getDb();
    const result = await db.collection("books").updateOne(
      { _id: new ObjectId(id) },
      { $set: payload },
    );

    if (result.matchedCount === 0) {
      this.setStatus(404);
      return null;
    }

    const updated: Book = { ...payload, id };
    await publishBookEvent({ type: "book.upserted", book: updated });
    return updated;
  }

  @Delete("{id}")
  public async deleteBook(@Path() id: string): Promise<{ deleted: boolean }> {
    if (!ObjectId.isValid(id)) {
      this.setStatus(400);
      return { deleted: false };
    }

    const db = await getDb();
    const result = await db.collection("books").deleteOne({ _id: new ObjectId(id) });
    const deleted = result.deletedCount === 1;

    if (deleted) {
      await publishBookEvent({ type: "book.deleted", bookId: id });
    }

    return { deleted };
  }
}
