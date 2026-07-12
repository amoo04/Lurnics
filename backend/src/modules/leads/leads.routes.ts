import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate } from "../../middleware/auth.js";
import { requirePermission } from "../../middleware/auth.js";
import {
  createLeadSchema,
  listLeadsQuerySchema,
  sendLeadEmailSchema,
  updateLeadSchema,
} from "./leads.schema.js";
import {
  changeLeadStatus,
  getLead,
  listLeads,
  removeLead,
  sendLeadEmail,
  submitLead,
} from "./leads.service.js";

export const leadsRoutes = new Hono<AppEnv>();

leadsRoutes.post("/send-email", authenticate(), requirePermission("leads:write"), async (c) => {
  const parsed = sendLeadEmailSchema.safeParse(await c.req.json());

  if (!parsed.success) {
    throw new ValidationError("Invalid email payload", parsed.error.flatten().fieldErrors);
  }

  const result = await sendLeadEmail(parsed.data);
  return c.json({ success: true, data: result });
});

leadsRoutes.post("/", async (c) => {
  const parsed = createLeadSchema.safeParse(await c.req.json());

  if (!parsed.success) {
    throw new ValidationError("Invalid lead payload", parsed.error.flatten().fieldErrors);
  }

  const lead = await submitLead(parsed.data);
  return c.json({ success: true, data: lead }, 201);
});

leadsRoutes.get("/", authenticate(), requirePermission("leads:read"), async (c) => {
  const parsed = listLeadsQuerySchema.safeParse(c.req.query());

  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listLeads(parsed.data);
  return c.json({ success: true, data: result });
});

leadsRoutes.get("/:id", authenticate(), requirePermission("leads:read"), async (c) => {
  const lead = await getLead(c.req.param("id"));
  return c.json({ success: true, data: lead });
});

leadsRoutes.patch("/:id", authenticate(), requirePermission("leads:write"), async (c) => {
  const parsed = updateLeadSchema.safeParse(await c.req.json());

  if (!parsed.success) {
    throw new ValidationError("Invalid status payload", parsed.error.flatten().fieldErrors);
  }

  const lead = await changeLeadStatus(c.get("userId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: lead });
});

leadsRoutes.delete("/:id", authenticate(), requirePermission("leads:delete"), async (c) => {
  await removeLead(c.get("userId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
