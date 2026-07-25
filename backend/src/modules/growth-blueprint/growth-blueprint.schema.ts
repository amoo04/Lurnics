import { z } from "zod";

export const createGrowthBlueprintSchema = z.object({
  companyName: z.string().min(1),
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().min(1),
  country: z.string().min(1),
  employees: z.string().min(1),
  revenueRange: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  businessModel: z.enum(["B2B", "B2C", "Marketplace", "Subscription", "Other"]),
  goals: z.array(z.string()).min(1),
  currentChannels: z.array(z.string()).optional(),
  monthlyBudget: z.string().optional(),
  hasWebsite: z.boolean().optional(),
  hasLandingPages: z.boolean().optional(),
  hasCrm: z.boolean().optional(),
  hasEmailAutomation: z.boolean().optional(),
  hasAnalytics: z.boolean().optional(),
  challenges: z.array(z.string()).min(1),
});

export const listGrowthBlueprintsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
});

export type CreateGrowthBlueprintInput = z.infer<typeof createGrowthBlueprintSchema>;
