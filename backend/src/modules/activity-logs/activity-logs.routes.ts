import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { listActivityLogsQuerySchema } from "./activity-logs.schema.js";
import { listActivityLogs } from "./activity-logs.service.js";

export const activityLogsRoutes = new Hono<AppEnv>();

activityLogsRoutes.use("*", authenticate());

activityLogsRoutes.get("/", requirePermission("activity-logs:read"), async (c) => {
  const parsed = listActivityLogsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listActivityLogs(parsed.data);
  return c.json({ success: true, data: result });
});
