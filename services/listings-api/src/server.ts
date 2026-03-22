import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { RegisterRoutes } from './build/routes';
import { connectToDatabase } from './db';
import { initializeMessaging } from './messaging';

const app = new Koa();
const port = Number(process.env.PORT ?? 3001);

app.use(bodyParser());

RegisterRoutes(app);

async function start() {
  await connectToDatabase();
  await initializeMessaging();
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});