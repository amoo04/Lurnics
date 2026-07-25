import { z } from "zod";

export const updateSectionSchema = z.object({
  visible: z.boolean().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
});

export const reorderSectionsSchema = z.object({
  orderedIds: z.array(z.string()).min(1),
});

export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;
export type ReorderSectionsInput = z.infer<typeof reorderSectionsSchema>;
