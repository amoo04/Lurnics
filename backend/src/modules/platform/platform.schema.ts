import { z } from "zod";

export const registerBusinessSchema = z.object({
  businessName: z.string().min(2),
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

export const platformLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const updateBusinessSchema = z.object({
  theme: z.enum(["classic", "modern", "minimal"]).optional(),
  customDomain: z.string().min(1).nullable().optional(),
});

export type RegisterBusinessInput = z.infer<typeof registerBusinessSchema>;
export type PlatformLoginInput = z.infer<typeof platformLoginSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
