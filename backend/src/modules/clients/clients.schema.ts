import { z } from "zod";

export const createClientSchema = z.object({
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  industry: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
});

export const updateClientSchema = createClientSchema.partial();

export const listClientsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  search: z.string().optional(),
});

export const sendClientEmailSchema = z.object({
  type: z.enum(["newsletter", "pitch", "update", "custom"]),
  subject: z.string().min(1),
  body: z.string().min(1),
  ctaLabel: z.string().optional(),
  ctaUrl: z.string().url().optional(),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type SendClientEmailInput = z.infer<typeof sendClientEmailSchema>;
