import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const updateRoleSchema = createRoleSchema.partial();

export const setRolePermissionsSchema = z.object({
  permissionIds: z.array(z.string()),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
