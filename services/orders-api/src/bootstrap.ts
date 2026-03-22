import { getDatabase } from './db';

interface ListingBook {
  id?: string;
}

export async function bootstrapValidBooks(): Promise<void> {
  const url = process.env.LISTINGS_API_URL;
  if (!url) return;

  try {
    const response = await fetch(url);
    if (!response.ok) return;
    const books = await response.json() as ListingBook[];
    const db = getDatabase();
    const validBooks = db.collection('valid_books');
    for (const book of books) {
      if (!book.id) continue;
      await validBooks.updateOne(
        { bookId: book.id },
        { $set: { bookId: book.id } },
        { upsert: true }
      );
    }
  } catch {
    // best effort bootstrap
  }
}
