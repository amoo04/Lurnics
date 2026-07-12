import { Hono } from "hono";
import type { AppEnv } from "../../lib/hono-env.js";
import { ValidationError } from "../../middleware/error.js";
import { authenticate, requirePermission } from "../../middleware/auth.js";
import {
  createMaintenanceSchema,
  listMaintenanceQuerySchema,
  updateMaintenanceSchema,
} from "./maintenance.schema.js";
import {
  addMaintenance,
  editMaintenance,
  getMaintenance,
  listMaintenance,
  removeMaintenance,
} from "./maintenance.service.js";

export const maintenanceRoutes = new Hono<AppEnv>();

maintenanceRoutes.use("*", authenticate());

maintenanceRoutes.get("/", requirePermission("maintenance:read"), async (c) => {
  const parsed = listMaintenanceQuerySchema.safeParse(c.req.query());
  if (!parsed.success) {
    throw new ValidationError("Invalid query", parsed.error.flatten().fieldErrors);
  }

  const result = await listMaintenance(parsed.data);
  return c.json({ success: true, data: result });
});

maintenanceRoutes.get("/:id", requirePermission("maintenance:read"), async (c) => {
  const contract = await getMaintenance(c.req.param("id"));
  return c.json({ success: true, data: contract });
});

maintenanceRoutes.post("/", requirePermission("maintenance:write"), async (c) => {
  const parsed = createMaintenanceSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid maintenance payload", parsed.error.flatten().fieldErrors);
  }

  const contract = await addMaintenance(c.get("userId"), parsed.data);
  return c.json({ success: true, data: contract }, 201);
});

maintenanceRoutes.patch("/:id", requirePermission("maintenance:write"), async (c) => {
  const parsed = updateMaintenanceSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    throw new ValidationError("Invalid maintenance payload", parsed.error.flatten().fieldErrors);
  }

  const contract = await editMaintenance(c.get("userId"), c.req.param("id"), parsed.data);
  return c.json({ success: true, data: contract });
});

maintenanceRoutes.delete("/:id", requirePermission("maintenance:delete"), async (c) => {
  await removeMaintenance(c.get("userId"), c.req.param("id"));
  return c.json({ success: true, data: null });
});
