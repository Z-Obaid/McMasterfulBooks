import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { connectToDatabase } from './db';
import { RegisterRoutes } from '../build/routes';
import { startOrdersSubscriber } from './messaging';
import { bootstrapValidBooks } from './bootstrap';

const app = new Koa();
const router = new Router();
app.use(bodyParser());
RegisterRoutes(router);
app.use(router.routes());
app.use(router.allowedMethods());

const port = Number(process.env.PORT ?? 3003);

void connectToDatabase().then(async () => {
  await startOrdersSubscriber();
  await bootstrapValidBooks();
  app.listen(port, () => {
    console.log(`Orders API listening on ${port}`);
  });
});
