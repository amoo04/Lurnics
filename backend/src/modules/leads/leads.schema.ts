import { z } from "zod";

export const createLeadSchema = z.object({
  companyName: z.string().min(1),
  contactPerson: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  budgetRange: z.string().optional(),
  source: z.string().optional(),
});

export const updateLeadSchema = z.object({
  status: z.enum(["new", "contacted", "proposal_sent", "won", "lost"]),
});

export const listLeadsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
});

export const sendLeadEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
