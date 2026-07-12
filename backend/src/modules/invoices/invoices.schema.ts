import { z } from "zod";

const lineItemSchema = z.object({
  description: z.string().min(1),
  amount: z.number(),
});

export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1),
  clientId: z.string().min(1),
  projectId: z.string().optional(),
  dueDate: z.string().min(1),
  status: z.enum(["draft", "pending", "paid", "overdue"]),
  notes: z.string().optional(),
  discount: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  lineItems: z.array(lineItemSchema).min(1),
});

export const updateInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1).optional(),
  clientId: z.string().min(1).optional(),
  projectId: z.string().optional(),
  dueDate: z.string().min(1).optional(),
  status: z.enum(["draft", "pending", "paid", "overdue"]).optional(),
  notes: z.string().optional(),
  discount: z.number().min(0).optional(),
  tax: z.number().min(0).optional(),
  lineItems: z.array(lineItemSchema).min(1).optional(),
});

export const listInvoicesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  clientId: z.string().optional(),
  search: z.string().optional(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
