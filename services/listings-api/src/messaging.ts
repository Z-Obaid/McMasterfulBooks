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

export async function startListingsSubscriber(): Promise<void> {
  const ch = await getChannel();
  const queue = await ch.assertQueue('', { exclusive: true });
  await ch.bindQueue(queue.queue, 'events', '');

  await ch.consume(queue.queue, async (msg) => {
    if (!msg) return;
    const event = JSON.parse(msg.content.toString()) as Record<string, unknown>;
    const db = getDatabase();
    const books = db.collection('books');

    if (event.type === 'BookStockChanged' && typeof event.bookId === 'string' && typeof event.totalStock === 'number') {
      await books.updateOne(
        { _id: event.bookId },
        { $set: { stock: event.totalStock } }
      );
    }

    ch.ack(msg);
  });
}
