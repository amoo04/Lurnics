import { z } from "zod";

export const updateIntegrationSchema = z.object({
  config: z.record(z.string(), z.unknown()).optional(),
  connected: z.boolean().optional(),
});

export type UpdateIntegrationInput = z.infer<typeof updateIntegrationSchema>;
