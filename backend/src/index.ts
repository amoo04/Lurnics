import { serve } from "@hono/node-server";
import { Hono } from "hono";
import auth from "./routes/auth.js";
import { authMiddleware } from "./middleware/auth.js";
import type { AppEnv } from "./lib/hono-env.js";

const app = new Hono<AppEnv>();

app.get("/health", (c) => c.json({ status: "ok" }));

app.route("/auth", auth);

app.get("/me", authMiddleware, (c) => {
  return c.json({ user: c.get("user") });
});

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Backend running on http://localhost:${info.port}`);
});
