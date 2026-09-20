import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import {
  createIndustrySchema,
  listIndustriesQuerySchema,
  updateIndustrySchema,
} from "./industries.schema.js";
import {
  addIndustry,
  editIndustry,
  getIndustryBySlug,
  listIndustries,
  removeIndustry,
} from "./industries.service.js";

export const industriesRoutes = new Hono<AppEnv>();

industriesRoutes.get("/", async (c) => {
  const parsed = listIndustriesQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listIndustries(parsed.data);
  return c.json({ success: true, data: result });
});

industriesRoutes.get("/:slug", async (c) => {
  const industry = await getIndustryBySlug(c.req.param("slug"));
  return c.json({ success: true, data: industry });
});

industriesRoutes.post("/", authenticate(), requirePermission("industries:write"), async (c) => {
  const parsed = createIndustrySchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid industry payload", parsed.error.flatten().fieldErrors);
  }

  const industry = await addIndustry(parsed.data);
  return c.json({ success: true, data: industry }, 201);
});

industriesRoutes.patch(
  "/:id",
  authenticate(),
  requirePermission("industries:write"),
  async (c) => {
    const parsed = updateIndustrySchema.safeParse(await c.req.json());
    if (!parsed.success) {
      throw new ValidationError("Invalid industry payload", parsed.error.flatten().fieldErrors);
    }

    const industry = await editIndustry(c.req.param("id"), parsed.data);
    return c.json({ success: true, data: industry });
  },
);

industriesRoutes.delete(
  "/:id",
  authenticate(),
  requirePermission("industries:delete"),
  async (c) => {
    await removeIndustry(c.req.param("id"));
    return c.json({ success: true, data: null });
  },
);
