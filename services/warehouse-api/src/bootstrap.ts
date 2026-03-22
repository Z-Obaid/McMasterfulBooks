import { getDatabase } from './db';

interface ListingBook {
  id?: string;
  name?: string;
}

export async function bootstrapWarehouseCache(): Promise<void> {
  const url = process.env.LISTINGS_API_URL;
  if (!url) return;

  try {
    const response = await fetch(url);
    if (!response.ok) return;
    const books = await response.json() as ListingBook[];
    const db = getDatabase();
    const cache = db.collection('book_cache');
    for (const book of books) {
      if (!book.id) continue;
      await cache.updateOne(
        { bookId: book.id },
        { $set: { bookId: book.id, name: book.name ?? '' } },
        { upsert: true }
      );
    }
  } catch {
    // best effort bootstrap
  }
}
