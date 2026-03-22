import amqp from 'amqplib';
import { getDatabase } from './db';

let channel: amqp.Channel | null = null;

async function getChannel(): Promise<amqp.Channel> {
  if (channel) return channel;
  const url = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const connection = await amqp.connect(url);
  channel = await connection.createChannel();
  await channel.assertExchange('events', 'fanout', { durable: false });
  return channel;
}

export async function publishEvent(event: Record<string, unknown>): Promise<void> {
  const ch = await getChannel();
  ch.publish('events', '', Buffer.from(JSON.stringify(event)));
}

export async function startWarehouseSubscriber(): Promise<void> {
  const ch = await getChannel();
  const queue = await ch.assertQueue('', { exclusive: true });
  await ch.bindQueue(queue.queue, 'events', '');

  await ch.consume(queue.queue, async (msg) => {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString()) as Record<string, unknown>;
    const db = getDatabase();

    if (event.type === 'BookAdded' && typeof event.bookId === 'string') {
      await db.collection('book_cache').updateOne(
        { bookId: event.bookId },
        { $set: { bookId: event.bookId, name: String(event.name ?? '') } },
        { upsert: true }
      );
    }

    if (event.type === 'BookDeleted' && typeof event.bookId === 'string') {
      await db.collection('book_cache').deleteOne({ bookId: event.bookId });
      await db.collection('shelves').deleteMany({ bookId: event.bookId });
    }

    if (event.type === 'OrderFulfilled' && Array.isArray(event.fulfillment)) {
      for (const item of event.fulfillment as Array<Record<string, unknown>>) {
        const bookId = String(item.book ?? '');
        const shelf = String(item.shelf ?? '');
        const numberOfBooks = Number(item.numberOfBooks ?? 0);
        const shelves = db.collection('shelves');
        const existing = await shelves.findOne<{ count: number }>({ bookId, shelf });
        if (!existing) continue;
        const nextCount = Math.max(0, existing.count - numberOfBooks);
        if (nextCount === 0) {
          await shelves.deleteOne({ bookId, shelf });
        } else {
          await shelves.updateOne({ bookId, shelf }, { $set: { count: nextCount } });
        }
        const totalStock = await shelves.aggregate([
          { $match: { bookId } },
          { $group: { _id: '$bookId', total: { $sum: '$count' } } }
        ]).toArray();
        await publishEvent({ type: 'BookStockChanged', bookId, totalStock: totalStock[0]?.total ?? 0 });
      }
    }

    ch.ack(msg);
  });
}
