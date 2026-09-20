import { z } from "zod";

export const createNavItemSchema = z.object({
  location: z.enum(["main", "footer", "mobile"]).optional(),
  label: z.string().min(1),
  linkType: z.enum(["home", "shop", "collection", "page", "custom"]),
  targetSlug: z.string().optional(),
  customUrl: z.string().optional(),
  isVisible: z.boolean().optional(),
});

export const updateNavItemSchema = createNavItemSchema.partial();

export const reorderNavItemsSchema = z.object({
  orderedIds: z.array(z.string()).min(1),
});

export type CreateNavItemInput = z.infer<typeof createNavItemSchema>;
export type UpdateNavItemInput = z.infer<typeof updateNavItemSchema>;
