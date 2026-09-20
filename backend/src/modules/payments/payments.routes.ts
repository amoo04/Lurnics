import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import {
  createPaymentSchema,
  listPaymentsQuerySchema,
  updatePaymentSchema,
} from "./payments.schema.js";
import {
  editPayment,
  getPayment,
  listPayments,
  recordPayment,
  removePayment,
} from "./payments.service.js";

export const paymentsRoutes = new Hono<AppEnv>();

paymentsRoutes.use("*", authenticate());

paymentsRoutes.get("/", requirePermission("payments:read"), async (c) => {
  const parsed = listPaymentsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listPayments(parsed.data);
  return c.json({ success: true, data: result });
});

paymentsRoutes.get("/:id", requirePermission("payments:read"), async (c) => {
  const payment = await getPayment(c.req.param("id"));
  return c.json({ success: true, data: payment });
});

paymentsRoutes.post("/", requirePermission("payments:write"), async (c) => {
  const parsed = createPaymentSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid payment payload", parsed.error.flatten().fieldErrors);
  }

  const payment = await recordPayment(c.get("userId"), parsed.data);
  return c.json({ success: true, data: payment }, 201);
});

paymentsRoutes.patch("/:id", requirePermission("payments:write"), async (c) => {
  const parsed = updatePaymentSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid payment payload", parsed.error.flatten().fieldErrors);
  }

  const payment = await editPayment(c.get("userId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: payment });
});

paymentsRoutes.delete("/:id", requirePermission("payments:delete"), async (c) => {
  await removePayment(c.get("userId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
