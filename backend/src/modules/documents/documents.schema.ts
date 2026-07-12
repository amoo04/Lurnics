import { z } from "zod";

export const createDocumentSchema = z.object({
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  documentName: z.string().min(1),
  fileUrl: z.string().min(1),
  fileType: z.string().min(1),
});

export const listDocumentsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  clientId: z.string().optional(),
  projectId: z.string().optional(),
  search: z.string().optional(),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
