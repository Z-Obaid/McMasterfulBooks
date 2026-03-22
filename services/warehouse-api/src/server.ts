import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { connectToDatabase } from './db';
import { RegisterRoutes } from '../build/routes';
import { startWarehouseSubscriber } from './messaging';
import { bootstrapWarehouseCache } from './bootstrap';

const app = new Koa();
const router = new Router();
app.use(bodyParser());
RegisterRoutes(router);
app.use(router.routes());
app.use(router.allowedMethods());

const port = Number(process.env.PORT ?? 3002);

void connectToDatabase().then(async () => {
  await startWarehouseSubscriber();
  await bootstrapWarehouseCache();
  app.listen(port, () => {
    console.log(`Warehouse API listening on ${port}`);
  });
});
