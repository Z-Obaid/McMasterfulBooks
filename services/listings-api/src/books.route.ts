import { Body, Controller, Delete, Get, Path, Post, Queries, Route, Tags } from 'tsoa';
import { getDatabase } from './db';
import { publishEvent } from './messaging';

export interface FilterInput {
  from?: number;
  to?: number;
  name?: string;
  author?: string;
}

export interface BookDto {
  id?: string;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
}

interface BookDocument extends BookDto {
  _id: string;
}

function matchesFilter(book: BookDocument, filter: FilterInput): boolean {
  if (typeof filter.from === 'number' && book.price < filter.from) return false;
  if (typeof filter.to === 'number' && book.price > filter.to) return false;
  if (
    typeof filter.name === 'string' &&
    filter.name.trim() !== '' &&
    !book.name.toLowerCase().includes(filter.name.toLowerCase())
  ) return false;
  if (
    typeof filter.author === 'string' &&
    filter.author.trim() !== '' &&
    !book.author.toLowerCase().includes(filter.author.toLowerCase())
  ) return false;
  return true;
}

@Route('books')
@Tags('Books')
export class BooksRoute extends Controller {
  @Get()
  public async listBooks(@Queries() query?: FilterInput): Promise<BookDto[]> {
    const db = getDatabase();
    const docs = await db.collection<BookDocument>('books').find({}).toArray();
    const mapped = docs.map(({ _id, ...rest }) => ({ id: _id, ...rest }));

    if (!query || Object.keys(query).length === 0) {
      return mapped;
    }

    return mapped.filter((book) =>
      matchesFilter(
        { _id: book.id ?? '', ...book },
        {
          from: query.from,
          to: query.to,
          name: query.name,
          author: query.author
        }
      )
    );
  }

  @Get('{id}')
  public async getBook(@Path() id: string): Promise<BookDto | null> {
    const db = getDatabase();
    const doc = await db.collection<BookDocument>('books').findOne({ _id: id });
    if (!doc) {
      this.setStatus(404);
      return null;
    }
    const { _id, ...rest } = doc;
    return { id: _id, ...rest };
  }

  @Post()
  public async createOrUpdateBook(@Body() body: BookDto): Promise<{ id: string }> {
    const db = getDatabase();
    const collection = db.collection<BookDocument>('books');

    if (body.id) {
      await collection.updateOne(
        { _id: body.id },
        {
          $set: {
            name: body.name,
            author: body.author,
            description: body.description,
            price: body.price,
            image: body.image
          }
        },
        { upsert: true }
      );
      return { id: body.id };
    }

    const id = crypto.randomUUID();
    const doc: BookDocument = {
      _id: id,
      name: body.name,
      author: body.author,
      description: body.description,
      price: body.price,
      image: body.image,
      stock: 0
    };
    await collection.insertOne(doc);
    await publishEvent({ type: 'BookAdded', bookId: id, name: body.name, author: body.author });
    return { id };
  }

  @Delete('{id}')
  public async deleteBook(@Path() id: string): Promise<void> {
    const db = getDatabase();
    await db.collection<BookDocument>('books').deleteOne({ _id: id });
    await publishEvent({ type: 'BookDeleted', bookId: id });
  }
}