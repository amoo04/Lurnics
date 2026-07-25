import { z } from "zod";

export const createCampaignSchema = z.object({
  name: z.string().min(1),
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().min(1),
  ctaUrl: z.string().url().optional(),
  audience: z.enum(["all_customers", "active_customers"]).optional(),
});

export const listCampaignsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
