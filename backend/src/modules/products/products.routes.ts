import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { createProductSchema, listProductsQuerySchema, updateProductSchema } from "./products.schema.js";
import {
  addProduct,
  editProduct,
  getInventoryStats,
  getProduct,
  getProductStats,
  listProducts,
  removeProduct,
} from "./products.service.js";

export const productsRoutes = new Hono<AppEnv>();

productsRoutes.use("*", authenticatePlatform());

productsRoutes.post("/", async (c) => {
  const parsed = createProductSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid product payload", parsed.error.flatten().fieldErrors);
  }

  const product = await addProduct(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: product }, 201);
});

productsRoutes.get("/stats", async (c) => {
  const stats = await getProductStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

productsRoutes.get("/inventory/stats", async (c) => {
  const stats = await getInventoryStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

productsRoutes.get("/", async (c) => {
  const parsed = listProductsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listProducts(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: result });
});

productsRoutes.get("/:id", async (c) => {
  const product = await getProduct(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: product });
});

productsRoutes.patch("/:id", async (c) => {
  const parsed = updateProductSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid product payload", parsed.error.flatten().fieldErrors);
  }

  const product = await editProduct(c.get("businessId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: product });
});

productsRoutes.delete("/:id", async (c) => {
  await removeProduct(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
