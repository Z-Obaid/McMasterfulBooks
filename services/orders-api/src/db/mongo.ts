import { Db, MongoClient } from "mongodb";

let databasePromise: Promise<Db> | null = null;

export function getDb(): Promise<Db> {
  if (!databasePromise) {
    const mongoUri = process.env.MONGO_URI || "mongodb://mongo-orders:27017";
    const dbName = process.env.DB_NAME || "orders";

    databasePromise = (async () => {
      const client = new MongoClient(mongoUri);
      await client.connect();
      return client.db(dbName);
    })();
  }

  return databasePromise;
}
