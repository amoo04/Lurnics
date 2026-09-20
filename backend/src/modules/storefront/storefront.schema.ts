import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
});

export const shopQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  collectionSlug: z.string().optional(),
});
