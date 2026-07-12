import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { updateIntegrationSchema } from "./integrations.schema.js";
import { listIntegrations, updateIntegration } from "./integrations.service.js";

export const integrationsRoutes = new Hono<AppEnv>();

integrationsRoutes.use("*", authenticate());

integrationsRoutes.get("/", requirePermission("integrations:read"), async (c) => {
  const integrations = await listIntegrations();
  return c.json({ success: true, data: integrations });
});

integrationsRoutes.patch("/:key", requirePermission("integrations:write"), async (c) => {
  const parsed = updateIntegrationSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid integration payload", parsed.error.flatten().fieldErrors);
  }

  const integration = await updateIntegration(c.req.param("key"), parsed.data);
  return c.json({ success: true, data: integration });
});
