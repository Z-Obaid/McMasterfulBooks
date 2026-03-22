import { Body, Get, Path, Post, Route, Tags } from 'tsoa';
import { getDatabase } from './db';
import { publishEvent } from './messaging';

export interface CreateOrderRequest {
  books: string[];
}

export interface FulfillmentItem {
  book: string;
  shelf: string;
  numberOfBooks: number;
}

export interface OrderDto {
  orderId: string;
  books: Record<string, number>;
  fulfilled: boolean;
}

@Route('orders')
@Tags('Orders')
export class OrdersRoute {
  @Get()
  public async listOrders(): Promise<OrderDto[]> {
    const db = getDatabase();
    return await db.collection<OrderDto>('orders').find({}).toArray();
  }

  @Get('{orderId}')
  public async getOrder(@Path() orderId: string): Promise<OrderDto | null> {
    const db = getDatabase();
    return await db.collection<OrderDto>('orders').findOne({ orderId });
  }

  @Post()
  public async createOrder(@Body() body: CreateOrderRequest): Promise<{ orderId: string }> {
    const db = getDatabase();
    const validIds = new Set((await db.collection<{ bookId: string }>('valid_books').find({}).toArray()).map((row) => row.bookId));
    for (const bookId of body.books) {
      if (!validIds.has(bookId)) {
        throw new Error(`Unknown book id: ${bookId}`);
      }
    }

    const counts: Record<string, number> = {};
    for (const bookId of body.books) {
      counts[bookId] = (counts[bookId] ?? 0) + 1;
    }

    const orderId = crypto.randomUUID();
    await db.collection<OrderDto>('orders').insertOne({ orderId, books: counts, fulfilled: false });
    return { orderId };
  }

  @Post('{orderId}/fulfill')
  public async fulfillOrder(@Path() orderId: string, @Body() body: { fulfillment: FulfillmentItem[] }): Promise<{ success: boolean }> {
    const db = getDatabase();
    await db.collection<OrderDto>('orders').updateOne({ orderId }, { $set: { fulfilled: true } });
    await publishEvent({ type: 'OrderFulfilled', orderId, fulfillment: body.fulfillment });
    return { success: true };
  }
}
