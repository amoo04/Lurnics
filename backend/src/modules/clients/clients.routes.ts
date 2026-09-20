import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import {
  createClientSchema,
  listClientsQuerySchema,
  sendClientEmailSchema,
  updateClientSchema,
} from "./clients.schema.js";
import {
  addClient,
  editClient,
  getClient,
  listClients,
  removeClient,
  sendClientEmail,
} from "./clients.service.js";

export const clientsRoutes = new Hono<AppEnv>();

clientsRoutes.use("*", authenticate());

clientsRoutes.get("/", requirePermission("clients:read"), async (c) => {
  const parsed = listClientsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listClients(parsed.data);
  return c.json({ success: true, data: result });
});

clientsRoutes.get("/:id", requirePermission("clients:read"), async (c) => {
  const client = await getClient(c.req.param("id"));
  return c.json({ success: true, data: client });
});

clientsRoutes.post("/", requirePermission("clients:write"), async (c) => {
  const parsed = createClientSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid client payload", parsed.error.flatten().fieldErrors);
  }

  const client = await addClient(c.get("userId"), parsed.data);
  return c.json({ success: true, data: client }, 201);
});

clientsRoutes.patch("/:id", requirePermission("clients:write"), async (c) => {
  const parsed = updateClientSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid client payload", parsed.error.flatten().fieldErrors);
  }

  const client = await editClient(c.get("userId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: client });
});

clientsRoutes.delete("/:id", requirePermission("clients:delete"), async (c) => {
  await removeClient(c.get("userId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});

clientsRoutes.post("/:id/send-email", requirePermission("clients:write"), async (c) => {
  const parsed = sendClientEmailSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid email payload", parsed.error.flatten().fieldErrors);
  }

  const result = await sendClientEmail(c.get("userId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: result });
});
