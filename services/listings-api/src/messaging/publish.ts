import amqp from "amqplib";

let channelPromise: Promise<amqp.Channel> | null = null;

async function getChannel(): Promise<amqp.Channel> {
  if (!channelPromise) {
    channelPromise = (async () => {
      const url = process.env.RABBITMQ_URL || "amqp://rabbitmq:5672";
      const connection = await amqp.connect(url);
      const channel = await connection.createChannel();
      await channel.assertExchange("books.events", "fanout", { durable: false });
      return channel;
    })();
  }

  return channelPromise;
}

export async function publishBookEvent(event: unknown): Promise<void> {
  const channel = await getChannel();
  channel.publish("books.events", "", Buffer.from(JSON.stringify(event)));
}
