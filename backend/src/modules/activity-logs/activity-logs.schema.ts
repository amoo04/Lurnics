import { z } from "zod";

export const listActivityLogsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  entityType: z.string().optional(),
  action: z.string().optional(),
  userId: z.string().optional(),
});
