import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./index.js";
import { initBindings } from "./lib/env.js";
import { ensureUpdatedAtTriggers } from "./db/index.js";

// SEB (Cloudflare's Send Email binding) and BUCKET (R2) don't exist outside
// the Workers runtime, so they're intentionally omitted here - see
// lib/email.ts and lib/r2.ts for the local-dev fallback behavior this causes.
initBindings({
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./data/lurnics.db",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  EMAIL_FROM: process.env.EMAIL_FROM ?? "info@lurnics.com",
  LEADS_EMAIL_FROM: process.env.LEADS_EMAIL_FROM ?? "info@lurnics.com",
  NODE_ENV: process.env.NODE_ENV,
});

await ensureUpdatedAtTriggers();

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Backend running on http://localhost:${info.port}`);
});
