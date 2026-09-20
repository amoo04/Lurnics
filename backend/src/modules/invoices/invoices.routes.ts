import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import {
  createInvoiceSchema,
  listInvoicesQuerySchema,
  updateInvoiceSchema,
} from "./invoices.schema.js";
import {
  addInvoice,
  editInvoice,
  getInvoice,
  listInvoices,
  removeInvoice,
} from "./invoices.service.js";

export const invoicesRoutes = new Hono<AppEnv>();

invoicesRoutes.use("*", authenticate());

invoicesRoutes.get("/", requirePermission("invoices:read"), async (c) => {
  const parsed = listInvoicesQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listInvoices(parsed.data);
  return c.json({ success: true, data: result });
});

invoicesRoutes.get("/:id", requirePermission("invoices:read"), async (c) => {
  const invoice = await getInvoice(c.req.param("id"));
  return c.json({ success: true, data: invoice });
});

invoicesRoutes.post("/", requirePermission("invoices:write"), async (c) => {
  const parsed = createInvoiceSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid invoice payload", parsed.error.flatten().fieldErrors);
  }

  const invoice = await addInvoice(c.get("userId"), parsed.data);
  return c.json({ success: true, data: invoice }, 201);
});

invoicesRoutes.patch("/:id", requirePermission("invoices:write"), async (c) => {
  const parsed = updateInvoiceSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid invoice payload", parsed.error.flatten().fieldErrors);
  }

  const invoice = await editInvoice(c.get("userId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: invoice });
});

invoicesRoutes.delete("/:id", requirePermission("invoices:delete"), async (c) => {
  await removeInvoice(c.get("userId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
