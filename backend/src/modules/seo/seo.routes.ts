import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { getSeoAudit } from "./seo.service.js";

export const seoRoutes = new Hono<AppEnv>();

seoRoutes.use("*", authenticatePlatform());

seoRoutes.get("/audit", async (c) => {
  const audit = await getSeoAudit(c.get("businessId"));
  return c.json({ success: true, data: audit });
});
