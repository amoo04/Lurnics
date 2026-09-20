import { z } from "zod";

export const reportsQuerySchema = z.object({
  months: z.string().optional(),
});
