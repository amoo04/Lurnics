import { z } from "zod";

export const createMaintenanceSchema = z.object({
  clientId: z.string().min(1),
  projectId: z.string().optional(),
  planType: z.string().min(1),
  amount: z.number().positive(),
  startDate: z.string().min(1),
  expiryDate: z.string().min(1),
  status: z.enum(["active", "expiring_soon", "overdue", "cancelled"]),
  autoReminder: z.boolean().optional(),
});

export const updateMaintenanceSchema = createMaintenanceSchema.partial();

export const listMaintenanceQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});

export type CreateMaintenanceInput = z.infer<typeof createMaintenanceSchema>;
export type UpdateMaintenanceInput = z.infer<typeof updateMaintenanceSchema>;
