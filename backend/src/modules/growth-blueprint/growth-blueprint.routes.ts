import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { ValidationError } from "../../middleware/error.js";
import { createGrowthBlueprintSchema, listGrowthBlueprintsQuerySchema } from "./growth-blueprint.schema.js";
import {
  getGrowthBlueprintSubmission,
  listGrowthBlueprintSubmissions,
  submitGrowthBlueprint,
} from "./growth-blueprint.service.js";

export const growthBlueprintRoutes = new Hono<AppEnv>();

growthBlueprintRoutes.post("/", async (c) => {
  const parsed = createGrowthBlueprintSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid growth blueprint payload", parsed.error.flatten().fieldErrors);
  }

  const submission = await submitGrowthBlueprint(parsed.data);
  return c.json({ success: true, data: submission }, 201);
});

growthBlueprintRoutes.get("/", authenticate(), requirePermission("leads:read"), async (c) => {
  const parsed = listGrowthBlueprintsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listGrowthBlueprintSubmissions(parsed.data);
  return c.json({ success: true, data: result });
});

growthBlueprintRoutes.get("/:id", authenticate(), requirePermission("leads:read"), async (c) => {
  const submission = await getGrowthBlueprintSubmission(c.req.param("id"));
  return c.json({ success: true, data: submission });
});
