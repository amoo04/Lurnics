import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticatePlatform } from "../../middleware/platform-auth.js";
import { createCustomerSchema, listCustomersQuerySchema, updateCustomerSchema } from "./customers.schema.js";
import {
  addCustomer,
  editCustomer,
  getCustomer,
  getCustomerStats,
  listCustomers,
  removeCustomer,
} from "./customers.service.js";

export const customersRoutes = new Hono<AppEnv>();

customersRoutes.use("*", authenticatePlatform());

customersRoutes.post("/", async (c) => {
  const parsed = createCustomerSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid customer payload", parsed.error.flatten().fieldErrors);
  }

  const customer = await addCustomer(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: customer }, 201);
});

customersRoutes.get("/stats", async (c) => {
  const stats = await getCustomerStats(c.get("businessId"));
  return c.json({ success: true, data: stats });
});

customersRoutes.get("/", async (c) => {
  const parsed = listCustomersQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listCustomers(c.get("businessId"), parsed.data);
  return c.json({ success: true, data: result });
});

customersRoutes.get("/:id", async (c) => {
  const customer = await getCustomer(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: customer });
});

customersRoutes.patch("/:id", async (c) => {
  const parsed = updateCustomerSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid customer payload", parsed.error.flatten().fieldErrors);
  }

  const customer = await editCustomer(c.get("businessId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: customer });
});

customersRoutes.delete("/:id", async (c) => {
  await removeCustomer(c.get("businessId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
