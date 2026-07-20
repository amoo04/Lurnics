// Minimal local shape for Cloudflare's Send Email binding, rather than
// pulling in @cloudflare/workers-types' ambient globals (which redeclare
// Request/Response/etc. and can conflict with @types/node's versions of the
// same globals across a codebase that runs both on Node and on Workers).
export interface SendEmailBinding {
  send(message: unknown): Promise<void>;
}

export interface AppBindings {
  DATABASE_URL: string;
  JWT_SECRET: string;
  EMAIL_FROM: string;
  LEADS_EMAIL_FROM: string;
  NODE_ENV?: string;
  SEB?: SendEmailBinding;
  R2_ACCOUNT_ID?: string;
  R2_ACCESS_KEY_ID?: string;
  R2_SECRET_ACCESS_KEY?: string;
  R2_BUCKET?: string;
  // The bucket's public base URL (r2.dev subdomain or a custom domain) -
  // separate from the R2_ACCOUNT_ID S3-API endpoint used for writes, since
  // that endpoint isn't itself publicly readable.
  R2_PUBLIC_URL?: string;
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
