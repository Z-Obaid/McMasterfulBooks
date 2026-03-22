import Koa from 'koa';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import { RegisterRoutes } from '../build/routes';
import { connectToDatabase } from './db';
import { startListingsSubscriber } from './messaging';

const app = new Koa();
const router = new Router();
const port = Number(process.env.PORT ?? 3001);

app.use(bodyParser());

RegisterRoutes(router);

app.use(router.routes());
app.use(router.allowedMethods());

async function start() {
  await connectToDatabase();
  await startListingsSubscriber();

  app.listen(port, () => {
    console.log(`Listings API running on port ${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});