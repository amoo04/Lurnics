import { z } from "zod";

export const createGiftCardSchema = z.object({
  type: z.enum(["digital", "physical"]).optional(),
  initialValue: z.number().min(0.01),
  recipientName: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  message: z.string().optional(),
  activatesAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

export const updateGiftCardSchema = z.object({
  recipientName: z.string().optional(),
  recipientEmail: z.string().email().optional(),
  message: z.string().optional(),
  activatesAt: z.string().optional(),
  expiresAt: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const redeemGiftCardSchema = z.object({
  amount: z.number().min(0.01),
});

export const listGiftCardsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["active", "redeemed", "expired", "scheduled"]).optional(),
  search: z.string().optional(),
});

export type CreateGiftCardInput = z.infer<typeof createGiftCardSchema>;
export type UpdateGiftCardInput = z.infer<typeof updateGiftCardSchema>;
export type RedeemGiftCardInput = z.infer<typeof redeemGiftCardSchema>;
