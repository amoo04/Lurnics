import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { analyticsQuerySchema } from "./analytics.schema.js";
import { getLeadsBySource, getLeadsByService, getLeadsFunnel, getLeadsOverTime } from "./analytics.service.js";

export const analyticsRoutes = new Hono<AppEnv>();

analyticsRoutes.use("*", authenticate());

analyticsRoutes.get("/leads-funnel", requirePermission("analytics:read"), async (c) => {
  const funnel = await getLeadsFunnel();
  return c.json({ success: true, data: funnel });
});

analyticsRoutes.get("/leads-over-time", requirePermission("analytics:read"), async (c) => {
  const parsed = analyticsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const series = await getLeadsOverTime(parsed.data);
  return c.json({ success: true, data: series });
});

analyticsRoutes.get("/leads-by-source", requirePermission("analytics:read"), async (c) => {
  const bySource = await getLeadsBySource();
  return c.json({ success: true, data: bySource });
});

analyticsRoutes.get("/leads-by-service", requirePermission("analytics:read"), async (c) => {
  const byService = await getLeadsByService();
  return c.json({ success: true, data: byService });
});
