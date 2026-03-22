import Koa from "koa";
import Router from "@koa/router";

const app = new Koa();
const router = new Router();

const services = {
  listings: process.env.LISTINGS_API_URL || "http://listings-api:3001",
  warehouse: process.env.WAREHOUSE_API_URL || "http://warehouse-api:3002",
  orders: process.env.ORDERS_API_URL || "http://orders-api:3003",
} as const;

type ServiceName = keyof typeof services;

function landingPage(): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>McMasterful Books Docs</title>
    <style>
      body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.5; }
      h1 { margin-bottom: 8px; }
      ul { padding-left: 20px; }
      a { text-decoration: none; }
    </style>
  </head>
  <body>
    <h1>McMasterful Books API Docs</h1>
    <p>Choose a service:</p>
    <ul>
      <li><a href="/docs/listings">Listings API</a></li>
      <li><a href="/docs/warehouse">Warehouse API</a></li>
      <li><a href="/docs/orders">Orders API</a></li>
    </ul>
  </body>
</html>`;
}

function isServiceName(value: string): value is ServiceName {
  return value === "listings" || value === "warehouse" || value === "orders";
}

router.get("/health", (ctx) => {
  ctx.body = { ok: true, service: "docs-server" };
});

router.get("/", (ctx) => {
  ctx.type = "text/html";
  ctx.body = landingPage();
});

router.get("/docs", (ctx) => {
  ctx.type = "text/html";
  ctx.body = landingPage();
});

router.get("/api/docs", (ctx) => {
  ctx.type = "text/html";
  ctx.body = landingPage();
});

router.get("/openapi/:service.json", async (ctx) => {
  const service = ctx.params.service;
  if (!isServiceName(service)) {
    ctx.status = 404;
    ctx.body = { error: "Unknown service" };
    return;
  }

  const response = await fetch(`${services[service]}/openapi.json`);
  ctx.status = response.status;
  ctx.type = "application/json";
  ctx.body = await response.text();
});

router.get("/docs/:service", (ctx) => {
  const service = ctx.params.service;
  if (!isServiceName(service)) {
    ctx.status = 404;
    ctx.body = { error: "Unknown service" };
    return;
  }

  ctx.type = "text/html";
  ctx.body = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${service} docs</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.onload = () => {
        SwaggerUIBundle({
          url: '/openapi/${service}.json',
          dom_id: '#swagger-ui'
        });
      };
    </script>
  </body>
</html>`;
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = Number(process.env.PORT ?? 3004);
app.listen(port, "0.0.0.0", () => {
  console.log(`Docs server listening on ${port}`);
});
