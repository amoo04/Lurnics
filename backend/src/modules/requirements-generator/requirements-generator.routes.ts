import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { ValidationError } from "../../middleware/error.js";
import {
  createRequirementsGeneratorSchema,
  listRequirementsGeneratorQuerySchema,
} from "./requirements-generator.schema.js";
import {
  getRequirementsGeneratorSubmission,
  listRequirementsGeneratorSubmissions,
  submitRequirementsGenerator,
} from "./requirements-generator.service.js";

export const requirementsGeneratorRoutes = new Hono<AppEnv>();

requirementsGeneratorRoutes.post("/", async (c) => {
  const parsed = createRequirementsGeneratorSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid payload", parsed.error.flatten().fieldErrors);
  }

  const submission = await submitRequirementsGenerator(parsed.data);
  return c.json({ success: true, data: submission }, 201);
});

requirementsGeneratorRoutes.get("/", authenticate(), requirePermission("leads:read"), async (c) => {
  const parsed = listRequirementsGeneratorQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listRequirementsGeneratorSubmissions(parsed.data);
  return c.json({ success: true, data: result });
});

requirementsGeneratorRoutes.get("/:id", authenticate(), requirePermission("leads:read"), async (c) => {
  const submission = await getRequirementsGeneratorSubmission(c.req.param("id"));
  return c.json({ success: true, data: submission });
});
