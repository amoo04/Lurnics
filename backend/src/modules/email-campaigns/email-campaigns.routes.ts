import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { createCampaignSchema, listCampaignsQuerySchema } from "./email-campaigns.schema.js";
import { addCampaign, getCampaign, getEmailStats, listCampaigns, sendCampaign } from "./email-campaigns.service.js";

export const emailCampaignsRoutes = new Hono<AppEnv>();

emailCampaignsRoutes.use("*", authenticatePlatform());

emailCampaignsRoutes.post("/", async (c) => {
  const parsed = createCampaignSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid campaign payload", parsed.error.flatten().fieldErrors);
  }

  const campaign = await addCampaign(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: campaign }, 201);
});

emailCampaignsRoutes.get("/stats", async (c) => {
  const stats = await getEmailStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

emailCampaignsRoutes.get("/", async (c) => {
  const parsed = listCampaignsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listCampaigns(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: result });
});

emailCampaignsRoutes.get("/:id", async (c) => {
  const campaign = await getCampaign(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: campaign });
});

emailCampaignsRoutes.post("/:id/send", async (c) => {
  const campaign = await sendCampaign(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: campaign });
});
