import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { createCartSchema, listCartsQuerySchema } from "./carts.schema.js";
import { getCart, getCartStats, listCarts, startCart } from "./carts.service.js";

export const cartsRoutes = new Hono<AppEnv>();

cartsRoutes.use("*", authenticatePlatform());

cartsRoutes.post("/", async (c) => {
  const parsed = createCartSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid cart payload", parsed.error.flatten().fieldErrors);
  }

  const cart = await startCart(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: cart }, 201);
});

cartsRoutes.get("/stats", async (c) => {
  const stats = await getCartStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

cartsRoutes.get("/", async (c) => {
  const parsed = listCartsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listCarts(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: result });
});

cartsRoutes.get("/:id", async (c) => {
  const cart = await getCart(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: cart });
});
