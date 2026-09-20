import { z } from "zod";

export const createPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().positive(),
  paymentMethod: z.string().min(1),
  transactionReference: z.string().optional(),
  paymentDate: z.string().min(1),
  status: z.enum(["pending", "completed", "failed"]),
});

export const updatePaymentSchema = createPaymentSchema.partial();

export const listPaymentsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  invoiceId: z.string().optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
