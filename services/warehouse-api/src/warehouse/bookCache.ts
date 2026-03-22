import { getDb } from "../db/mongo";

export interface CachedBook {
  id: string;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

export async function upsertCachedBook(book: CachedBook): Promise<void> {
  const db = await getDb();
  await db.collection("book_cache").updateOne(
    { id: book.id },
    { $set: book },
    { upsert: true },
  );
}

export async function deleteCachedBook(bookId: string): Promise<void> {
  const db = await getDb();
  await db.collection("book_cache").deleteOne({ id: bookId });
}
