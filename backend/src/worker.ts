import type { ExecutionContext } from "hono";
import { app } from "./index.js";
import { initBindings, type AppBindings } from "./lib/env.js";
import { ensureUpdatedAtTriggers } from "./db/index.js";

export default {
  async fetch(request: Request, env: AppBindings, ctx: ExecutionContext): Promise<Response> {
    initBindings(env);
    try {
      await ensureUpdatedAtTriggers();
    } catch (err) {
      // Don't let a broken/missing DATABASE_URL crash every request (even
      // ones that don't touch the DB, like /health) - routes that actually
      // need the database will fail on their own with a proper error
      // response instead of the whole Worker throwing.
      console.error("Failed to initialize database triggers:", err);
    }
    return app.fetch(request, env, ctx);
  },
};
