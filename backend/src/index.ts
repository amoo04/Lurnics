import "dotenv/config";
import { serve } from "@hono/node-server";
import { app } from "./app.js";
import { initBindings } from "./lib/env.js";
import { ensureUpdatedAtTriggers } from "./db/index.js";

// SEB (Cloudflare's Send Email binding) doesn't exist outside the Workers
// runtime, so it's intentionally omitted here - see lib/email.ts for the
// local-dev fallback behavior this causes.
initBindings({
  DATABASE_URL: process.env.DATABASE_URL ?? "file:./data/lurnics.db",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
  EMAIL_FROM: process.env.EMAIL_FROM ?? "noreply@lurnics.com",
  LEADS_EMAIL_FROM: process.env.LEADS_EMAIL_FROM ?? "pitch@lurnics.com",
  NODE_ENV: process.env.NODE_ENV,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET: process.env.R2_BUCKET,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
});

await ensureUpdatedAtTriggers();

const port = Number(process.env.PORT ?? 3001);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Backend running on http://localhost:${info.port}`);
});
