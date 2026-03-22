import amqp from "amqplib";
import { deleteCachedBook, upsertCachedBook } from "../orders/bookCache";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function startOrdersSubscriber(): Promise<void> {
  const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";

  while (true) {
    try {
      const connection = await amqp.connect(url);
      const channel = await connection.createChannel();
      await channel.assertExchange("books.events", "fanout", { durable: false });
      const queue = await channel.assertQueue("", { exclusive: true });
      await channel.bindQueue(queue.queue, "books.events", "");

      channel.consume(queue.queue, async (message) => {
        if (!message) return;

        const event = JSON.parse(message.content.toString()) as
          | { type: "book.upserted"; book: { id: string; name: string; author: string; description: string; price: number; image: string } }
          | { type: "book.deleted"; bookId: string };

        if (event.type === "book.upserted") {
          await upsertCachedBook(event.book);
        } else if (event.type === "book.deleted") {
          await deleteCachedBook(event.bookId);
        }

        channel.ack(message);
      });

      return;
    } catch (error) {
      console.error("Orders subscriber failed, retrying...", error);
      await sleep(5000);
    }
  }
}
