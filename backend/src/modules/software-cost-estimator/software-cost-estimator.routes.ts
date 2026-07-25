import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { ValidationError } from "../../middleware/error.js";
import {
  createSoftwareCostEstimatorSchema,
  listSoftwareCostEstimatorQuerySchema,
} from "./software-cost-estimator.schema.js";
import {
  getSoftwareCostEstimatorSubmission,
  listSoftwareCostEstimatorSubmissions,
  submitSoftwareCostEstimator,
} from "./software-cost-estimator.service.js";

export const softwareCostEstimatorRoutes = new Hono<AppEnv>();

softwareCostEstimatorRoutes.post("/", async (c) => {
  const parsed = createSoftwareCostEstimatorSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid payload", parsed.error.flatten().fieldErrors);
  }

  const submission = await submitSoftwareCostEstimator(parsed.data);
  return c.json({ success: true, data: submission }, 201);
});

softwareCostEstimatorRoutes.get("/", authenticate(), requirePermission("leads:read"), async (c) => {
  const parsed = listSoftwareCostEstimatorQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listSoftwareCostEstimatorSubmissions(parsed.data);
  return c.json({ success: true, data: result });
});

softwareCostEstimatorRoutes.get("/:id", authenticate(), requirePermission("leads:read"), async (c) => {
  const submission = await getSoftwareCostEstimatorSubmission(c.req.param("id"));
  return c.json({ success: true, data: submission });
});
