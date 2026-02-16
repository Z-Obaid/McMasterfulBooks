import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import { beforeAll, afterAll } from 'vitest';

let instance: MongoMemoryServer;

declare global {
  // eslint-disable-next-line no-var
  var MONGO_URI: string;
  // eslint-disable-next-line no-var
  var TEST_CLIENT: MongoClient;
}

beforeAll(async () => {
  instance = await MongoMemoryServer.create({
    binary: { version: '7.0.7' }
  });

  const uri = instance.getUri();

  global.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));

  global.TEST_CLIENT = new MongoClient(uri);
  await global.TEST_CLIENT.connect();
});

afterAll(async () => {
  if (global.TEST_CLIENT) {
    await global.TEST_CLIENT.close();
  }
  if (instance) {
    await instance.stop();
  }
});
