import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { findBusinessById } from "../platform/platform.repository.js";
import { createOrderSchema, listOrdersQuerySchema, updateOrderStatusSchema } from "./orders.schema.js";
import { changeOrderStatus, getOrder, getOrderStats, listOrders, placeOrder } from "./orders.service.js";

export const ordersRoutes = new Hono<AppEnv>();

ordersRoutes.use("*", authenticatePlatform());

ordersRoutes.post("/", async (c) => {
  const parsed = createOrderSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid order payload", parsed.error.flatten().fieldErrors);
  }

  const business = await findBusinessById(c.get("businessId"));
  const order = await placeOrder(c.get("businessId"), business?.currency ?? "USD", parsed.data);
  return c.json({ success: true, data: order }, 201);
});

ordersRoutes.get("/stats", async (c) => {
  const stats = await getOrderStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

ordersRoutes.get("/", async (c) => {
  const parsed = listOrdersQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listOrders(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: result });
});

ordersRoutes.get("/:id", async (c) => {
  const order = await getOrder(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: order });
});

ordersRoutes.patch("/:id/status", async (c) => {
  const parsed = updateOrderStatusSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid status payload", parsed.error.flatten().fieldErrors);
  }

  const order = await changeOrderStatus(c.get("businessId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: order });
});
