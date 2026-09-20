import { z } from "zod";

export const analyticsQuerySchema = z.object({
  months: z.string().optional(),
});
