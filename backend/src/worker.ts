import type { ExecutionContext } from "hono";
import { app } from "./index.js";
import { initBindings, type AppBindings } from "./lib/env.js";
import { ensureUpdatedAtTriggers } from "./db/index.js";
import { runMaintenanceReminders } from "./modules/maintenance/maintenance.service.js";

// Minimal shape of Cloudflare's ScheduledController, avoiding a dependency on
// the full @cloudflare/workers-types ambient global surface (see
// src/types/cloudflare-email.d.ts for the same reasoning).
interface ScheduledEventLike {
  cron: string;
  scheduledTime: number;
}

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

  // Runs once a day (see wrangler.jsonc `triggers.crons`) and sends
  // maintenance-plan renewal reminders on a weekly cadence starting a month
  // before each contract's expiry date.
  async scheduled(_event: ScheduledEventLike, env: AppBindings, ctx: ExecutionContext): Promise<void> {
    initBindings(env);
    ctx.waitUntil(
      (async () => {
        try {
          const result = await runMaintenanceReminders();
          console.log(`[maintenance-reminders] checked=${result.checked} sent=${result.sent}`);
        } catch (err) {
          console.error("Failed to run maintenance reminders:", err);
        }
      })(),
    );
  },
};
