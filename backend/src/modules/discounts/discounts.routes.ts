import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { createDiscountSchema, listDiscountsQuerySchema, updateDiscountSchema } from "./discounts.schema.js";
import {
  addDiscount,
  editDiscount,
  getDiscount,
  getDiscountStats,
  listDiscounts,
  redeemDiscount,
  removeDiscount,
} from "./discounts.service.js";

export const discountsRoutes = new Hono<AppEnv>();

discountsRoutes.use("*", authenticatePlatform());

discountsRoutes.post("/", async (c) => {
  const parsed = createDiscountSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid discount payload", parsed.error.flatten().fieldErrors);
  }

  const discount = await addDiscount(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: discount }, 201);
});

discountsRoutes.get("/stats", async (c) => {
  const stats = await getDiscountStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

discountsRoutes.get("/", async (c) => {
  const parsed = listDiscountsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listDiscounts(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: result });
});

discountsRoutes.get("/:id", async (c) => {
  const discount = await getDiscount(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: discount });
});

discountsRoutes.patch("/:id", async (c) => {
  const parsed = updateDiscountSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid discount payload", parsed.error.flatten().fieldErrors);
  }

  const discount = await editDiscount(c.get("businessId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: discount });
});

discountsRoutes.post("/:id/redeem", async (c) => {
  const discount = await redeemDiscount(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: discount });
});

discountsRoutes.delete("/:id", async (c) => {
  await removeDiscount(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
