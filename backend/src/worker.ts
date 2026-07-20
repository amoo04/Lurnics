import type { ExecutionContext } from "hono";
import { app } from "./app.js";
import { initBindings, type AppBindings } from "./lib/env.js";
import { ensureUpdatedAtTriggers } from "./db/index.js";

export default {
  async fetch(request: Request, env: AppBindings, ctx: ExecutionContext): Promise<Response> {
    initBindings(env);
    await ensureUpdatedAtTriggers();
    return app.fetch(request, env, ctx);
  },
};
