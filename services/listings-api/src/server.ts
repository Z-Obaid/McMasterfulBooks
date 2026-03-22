import Koa from "koa";
import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { RegisterRoutes } from "../build/routes";
import swaggerSpec from "../build/swagger.json";

const app = new Koa();
const router = new Router();

app.use(bodyParser());
RegisterRoutes(router);
app.use(router.routes());
app.use(router.allowedMethods());

const metaRouter = new Router();
metaRouter.get("/health", (ctx) => {
  ctx.body = { ok: true, service: "listings-api" };
});
metaRouter.get("/openapi.json", (ctx) => {
  ctx.type = "application/json";
  ctx.body = swaggerSpec;
});
app.use(metaRouter.routes());
app.use(metaRouter.allowedMethods());

const port = Number(process.env.PORT ?? 3001);
app.listen(port, "0.0.0.0", () => {
  console.log(`Listings API listening on ${port}`);
});
