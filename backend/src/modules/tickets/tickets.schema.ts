import { z } from "zod";

export const createTicketSchema = z.object({
  clientId: z.string().min(1),
  projectId: z.string().optional(),
  subject: z.string().min(1),
  description: z.string().min(1),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  assignedTo: z.string().optional(),
});

export const updateTicketSchema = createTicketSchema.partial();

export const listTicketsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  priority: z.string().optional(),
  clientId: z.string().optional(),
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
export type UpdateTicketInput = z.infer<typeof updateTicketSchema>;
