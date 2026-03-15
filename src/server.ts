import Koa from 'koa';
import cors from '@koa/cors';
import zodRouter from 'koa-zod-router';
import qs from 'koa-qs';
import bodyParser from 'koa-bodyparser';
import Router from '@koa/router';
import { koaSwagger } from 'koa2-swagger-ui';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { connectToDatabase } from './db';
import { registerBookRoutes } from './routes/book-routes';
import { registerWarehouseRoutes } from './warehouse/routes';
import { registerOrderRoutes } from './orders/routes';

const app = new Koa();
qs(app);
app.use(cors());
app.use(bodyParser());

const apiRouter = zodRouter();
registerBookRoutes(apiRouter);
registerWarehouseRoutes(apiRouter);
registerOrderRoutes(apiRouter);
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

const docsRouter = new Router();
const __dirname = path.dirname(__filename);
const swaggerPath = path.resolve(__dirname, '../build/swagger.json');

docsRouter.get('/docs/swagger.json', async (ctx) => {
  try {
    const spec = await readFile(swaggerPath, 'utf8');
    ctx.type = 'application/json';
    ctx.body = spec;
  } catch {
    ctx.status = 503;
    ctx.body = {
      error: 'OpenAPI spec not generated yet. Run npm install, then npm run generate.'
    };
  }
});

app.use(docsRouter.routes());
app.use(docsRouter.allowedMethods());
app.use(koaSwagger({
  routePrefix: '/docs',
  swaggerOptions: {
    url: '/docs/swagger.json'
  }
}));

connectToDatabase()
  .then(() => {
    app.listen(3000, () => {
      console.log('Server listening on port 3000');
      console.log('Swagger docs available at http://localhost:3000/docs');
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
