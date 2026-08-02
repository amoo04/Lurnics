import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

// Minimal local shape for Cloudflare's Send Email binding, rather than
// pulling in @cloudflare/workers-types' ambient globals (which redeclare
// Request/Response/etc. and can conflict with @types/node's versions of the
// same globals across a codebase that runs both on Node and on Workers).
// (D1Database above is a plain named type import, not an ambient global, so
// it doesn't carry that risk.)
export interface SendEmailBinding {
  send(message: unknown): Promise<void>;
}

export interface AppBindings {
  JWT_SECRET: string;
  EMAIL_FROM: string;
  LEADS_EMAIL_FROM: string;
  NODE_ENV?: string;
  // Resend API key (secret). When present, sendEmail() uses Resend's HTTP
  // API instead of Cloudflare's Send Email binding - Resend can deliver to
  // any recipient once the sending domain is verified, unlike SEB which
  // only delivers to addresses verified as a Destination Address.
  RESEND_API_KEY?: string;
  // This worker's own public base URL, used to build tracking-pixel /
  // click-redirect / unsubscribe links embedded in sent campaign emails.
  // Falls back to the local wrangler dev URL when unset.
  API_URL?: string;
  SEB?: SendEmailBinding;
  // Present only in the Workers runtime (deployed, or `wrangler dev`) - the
  // native D1 binding. Node local dev (`pnpm dev`) has no equivalent, so
  // db/index.ts falls back to a local SQLite file via @libsql/client when
  // this is absent.
  DB?: D1Database;
  // Only meaningful for that local-Node fallback; ignored once DB is bound.
  DATABASE_URL?: string;
  // Native R2 binding, present only in the Workers runtime (same story as
  // DB above). File uploads return 503 STORAGE_NOT_CONFIGURED when absent.
  // Uploaded files are served back through GET /api/uploads/:key (see
  // modules/uploads) rather than any public bucket URL.
  BUCKET?: R2Bucket;
}

let bindings: AppBindings | null = null;

// Cloudflare Workers bindings only arrive per-request via `c.env`, while the
// Node entrypoint has them at process start. Both call this once; later
// calls are no-ops so the same isolate/process can safely call it on every
// request without re-creating clients.
export function initBindings(env: AppBindings) {
  bindings ??= env;
}

export function getBindings(): AppBindings {
  if (!bindings) {
    throw new Error("App bindings not initialized. Call initBindings() before handling requests.");
  }
  return bindings;
}
