import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { NotFoundError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { findTemplateById, findTemplates } from "./email-templates.repository.js";

export const emailTemplatesRoutes = new Hono<AppEnv>();

emailTemplatesRoutes.use("*", authenticatePlatform());

emailTemplatesRoutes.get("/", async (c) => {
  const templates = await findTemplates(c.req.query("category"));
  return c.json({ success: true, data: templates });
});

emailTemplatesRoutes.get("/:id", async (c) => {
  const template = await findTemplateById(c.req.param("id"));
  if (!template) throw new NotFoundError("Template not found");
  return c.json({ success: true, data: template });
});
