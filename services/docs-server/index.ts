import Koa from 'koa';
import Router from '@koa/router';
import { readFile } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import swaggerUiDist from 'swagger-ui-dist';

const app = new Koa();
const router = new Router();
const port = Number(process.env.PORT ?? 3004);

const swaggerPath = path.resolve(process.cwd(), 'public/swagger.json');
const swaggerUiPath = swaggerUiDist.getAbsoluteFSPath();

router.get('/openapi.json', async (ctx) => {
  ctx.type = 'application/json';
  ctx.body = await readFile(swaggerPath, 'utf8');
});

router.get('/docs/swagger.json', async (ctx) => {
  ctx.type = 'application/json';
  ctx.body = await readFile(swaggerPath, 'utf8');
});

router.get('/docs', async (ctx) => {
  ctx.type = 'text/html';
  ctx.body = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Swagger UI</title>
  <link rel="stylesheet" href="/docs/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="/docs/swagger-ui-bundle.js"></script>
  <script src="/docs/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/docs/swagger.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: 'StandaloneLayout'
      });
    };
  </script>
</body>
</html>`;
});

router.get(/^\/docs\/(.+)$/, async (ctx) => {
  const relativePath = ctx.captures[0];
  const filePath = path.join(swaggerUiPath, relativePath);

  if (!existsSync(filePath)) {
    ctx.status = 404;
    ctx.body = 'Not found';
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.css') ctx.type = 'text/css';
  else if (ext === '.js') ctx.type = 'application/javascript';
  else if (ext === '.png') ctx.type = 'image/png';
  else if (ext === '.svg') ctx.type = 'image/svg+xml';
  else if (ext === '.html') ctx.type = 'text/html';

  ctx.body = createReadStream(filePath);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Docs server listening on ${port}`);
});