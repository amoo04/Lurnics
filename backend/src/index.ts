import { serve } from "@hono/node-server";
import { Hono } from "hono";
import type { AppEnv } from "./lib/hono-env.js";
import { onError, notFound } from "./middleware/error.js";

const app = new Hono<AppEnv>();

app.onError(onError);
app.notFound(notFound);

app.get("/health", (c) => c.json({ status: "ok" }));

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Backend running on http://localhost:${info.port}`);
});
