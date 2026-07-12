import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { reportsQuerySchema } from "./reports.schema.js";
import { getInvoicesReport, getProjectsReport, getRevenueReport } from "./reports.service.js";

export const reportsRoutes = new Hono<AppEnv>();

reportsRoutes.use("*", authenticate());

reportsRoutes.get("/revenue", requirePermission("reports:read"), async (c) => {
  const parsed = reportsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const revenue = await getRevenueReport(parsed.data);
  return c.json({ success: true, data: revenue });
});

reportsRoutes.get("/projects", requirePermission("reports:read"), async (c) => {
  const projects = await getProjectsReport();
  return c.json({ success: true, data: projects });
});

reportsRoutes.get("/invoices", requirePermission("reports:read"), async (c) => {
  const invoicesReport = await getInvoicesReport();
  return c.json({ success: true, data: invoicesReport });
});
