import { z } from "zod";

export const createRequirementsGeneratorSchema = z.object({
  companyName: z.string().optional(),
  contactName: z.string().min(1),
  email: z.string().email(),
  projectType: z.string().min(1),
  goal: z.string().min(1),
  mustHaveFeatures: z.array(z.string()).min(1),
  niceToHaveFeatures: z.array(z.string()).optional(),
  targetUsers: z.string().optional(),
  timeline: z.string().min(1),
  budgetRange: z.string().optional(),
});

export const listRequirementsGeneratorQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
});

export type CreateRequirementsGeneratorInput = z.infer<typeof createRequirementsGeneratorSchema>;
