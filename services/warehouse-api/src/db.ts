import { Db, MongoClient } from 'mongodb';

let client: MongoClient | null = null;
let database: Db | null = null;

export async function connectToDatabase(): Promise<Db> {
  if (database) return database;
  const uri = process.env.MONGODB_URL ?? 'mongodb://localhost:27017';
  const dbName = process.env.DATABASE_NAME ?? 'mcmasterful-books-warehouse';
  client = new MongoClient(uri);
  await client.connect();
  database = client.db(dbName);
  return database;
}

export function getDatabase(): Db {
  if (!database) throw new Error('Database not connected.');
  return database;
}
