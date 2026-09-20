import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { updateSettingsSchema } from "./settings.schema.js";
import { getSettings, saveSettings } from "./settings.service.js";

export const settingsRoutes = new Hono<AppEnv>();

settingsRoutes.use("*", authenticate());

settingsRoutes.get("/", requirePermission("settings:read"), async (c) => {
  const settings = await getSettings();
  return c.json({ success: true, data: settings });
});

settingsRoutes.put("/", requirePermission("settings:write"), async (c) => {
  const parsed = updateSettingsSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid settings payload");
  }

  const settings = await saveSettings(parsed.data);
  return c.json({ success: true, data: settings });
});
