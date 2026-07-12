import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import {
  createTicketSchema,
  listTicketsQuerySchema,
  updateTicketSchema,
} from "./tickets.schema.js";
import { addTicket, editTicket, getTicket, listTickets, removeTicket } from "./tickets.service.js";

export const ticketsRoutes = new Hono<AppEnv>();

ticketsRoutes.use("*", authenticate());

ticketsRoutes.get("/", requirePermission("tickets:read"), async (c) => {
  const parsed = listTicketsQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listTickets(parsed.data);
  return c.json({ success: true, data: result });
});

ticketsRoutes.get("/:id", requirePermission("tickets:read"), async (c) => {
  const ticket = await getTicket(c.req.param("id"));
  return c.json({ success: true, data: ticket });
});

ticketsRoutes.post("/", requirePermission("tickets:write"), async (c) => {
  const parsed = createTicketSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid ticket payload", parsed.error.flatten().fieldErrors);
  }

  const ticket = await addTicket(parsed.data);
  return c.json({ success: true, data: ticket }, 201);
});

ticketsRoutes.patch("/:id", requirePermission("tickets:write"), async (c) => {
  const parsed = updateTicketSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid ticket payload", parsed.error.flatten().fieldErrors);
  }

  const ticket = await editTicket(c.req.param("id"), parsed.data);
  return c.json({ success: true, data: ticket });
});

ticketsRoutes.delete("/:id", requirePermission("tickets:delete"), async (c) => {
  await removeTicket(c.req.param("id"));
  return c.json({ success: true, data: null });
});
