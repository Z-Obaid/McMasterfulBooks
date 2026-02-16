// src/database_access.ts
import { MongoClient, type Db, type Collection } from 'mongodb';
import { type Book } from './adapter/assignment-3';

const uri = global.MONGO_URI ?? 'mongodb://localhost:27017';

export const client = new MongoClient(uri);

export interface BookDatabaseAccessor {
  database: Db
  books: Collection<Book>
}

export function getBookDatabase(): BookDatabaseAccessor {
  const databaseName =
    global.MONGO_URI !== undefined
      ? `test_${Math.floor(Math.random() * 100000)}`
      : 'books';

  const database = client.db(databaseName);
  const books = database.collection<Book>('books');
  return { database, books };
}
