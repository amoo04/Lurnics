import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import { ValidationError } from "../../middleware/error.js";
import { createCalculatorSubmissionSchema, listCalculatorSubmissionsQuerySchema } from "./calculator.schema.js";
import {
  getCalculatorSubmission,
  listCalculatorSubmissions,
  submitCalculatorResult,
} from "./calculator.service.js";

export const calculatorRoutes = new Hono<AppEnv>();

calculatorRoutes.post("/", async (c) => {
  const parsed = createCalculatorSubmissionSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid calculator payload", parsed.error.flatten().fieldErrors);
  }

  const submission = await submitCalculatorResult(parsed.data);
  return c.json({ success: true, data: submission }, 201);
});

calculatorRoutes.get("/", authenticate(), requirePermission("leads:read"), async (c) => {
  const parsed = listCalculatorSubmissionsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listCalculatorSubmissions(parsed.data);
  return c.json({ success: true, data: result });
});

calculatorRoutes.get("/:id", authenticate(), requirePermission("leads:read"), async (c) => {
  const submission = await getCalculatorSubmission(c.req.param("id"));
  return c.json({ success: true, data: submission });
});
