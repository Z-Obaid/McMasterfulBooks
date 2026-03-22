import { Body, Get, Path, Post, Route, Tags } from 'tsoa';
import { getDatabase } from './db';
import { publishEvent } from './messaging';

export interface PlaceBooksRequest {
  bookId: string;
  numberOfBooks: number;
  shelf: string;
}

export interface ShelfStock {
  shelf: string;
  count: number;
}

@Route('warehouse')
@Tags('Warehouse')
export class WarehouseRoute {
  @Post('shelves')
  public async placeBooksOnShelf(@Body() body: PlaceBooksRequest): Promise<{ success: boolean }> {
    const db = getDatabase();
    const shelves = db.collection<{ bookId: string; shelf: string; count: number }>('shelves');
    const existing = await shelves.findOne({ bookId: body.bookId, shelf: body.shelf });
    const nextCount = (existing?.count ?? 0) + body.numberOfBooks;

    await shelves.updateOne(
      { bookId: body.bookId, shelf: body.shelf },
      { $set: { bookId: body.bookId, shelf: body.shelf, count: nextCount } },
      { upsert: true }
    );

    const totalStock = await shelves.aggregate([
      { $match: { bookId: body.bookId } },
      { $group: { _id: '$bookId', total: { $sum: '$count' } } }
    ]).toArray();

    await publishEvent({ type: 'BookStockChanged', bookId: body.bookId, totalStock: totalStock[0]?.total ?? 0 });
    return { success: true };
  }

  @Get('books/{bookId}/locations')
  public async findBookOnShelf(@Path() bookId: string): Promise<ShelfStock[]> {
    const db = getDatabase();
    const docs = await db.collection<{ bookId: string; shelf: string; count: number }>('shelves')
      .find({ bookId })
      .toArray();
    return docs.map(({ shelf, count }) => ({ shelf, count }));
  }
}
