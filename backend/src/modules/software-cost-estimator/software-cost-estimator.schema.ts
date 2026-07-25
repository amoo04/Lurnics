import { z } from "zod";

export const createSoftwareCostEstimatorSchema = z.object({
  companyName: z.string().optional(),
  contactName: z.string().min(1),
  email: z.string().email(),
  projectType: z.string().min(1),
  platforms: z.array(z.string()).min(1),
  features: z.array(z.string()).min(1),
  needsDesign: z.boolean().optional(),
  timeline: z.string().min(1),
  budgetRange: z.string().optional(),
});

export const listSoftwareCostEstimatorQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateSoftwareCostEstimatorInput = z.infer<typeof createSoftwareCostEstimatorSchema>;
