import { MongoClient, Collection } from 'mongodb';

const MONGO_URL = 'mongodb://mongo:27017';
const DB_NAME = 'mcmasterful-books';

export interface Book {
    _id?: any;
    name: string;
    author: string;
    description: string;
    price: number;
    image: string;
}

let client: MongoClient;

export async function connectToDatabase() {
    client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log('MongoDB connected');
}

export function getBooksCollection(): Collection<Book> {
    if (!client) {
        throw new Error('MongoDB client not initialized');
    }
    return client.db(DB_NAME).collection<Book>('books');
}
