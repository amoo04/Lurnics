import { z } from "zod";

export const createProjectSchema = z.object({
  clientId: z.string().min(1),
  projectName: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  projectType: z.string().min(1),
  status: z.string().min(1),
  progress: z.number().min(0).max(100).optional(),
  budget: z.number().optional(),
  startDate: z.string().optional(),
  dueDate: z.string().optional(),
  deploymentStatus: z.string().optional(),
});

export const updateProjectSchema = createProjectSchema.partial();

export const listProjectsQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.string().optional(),
  clientId: z.string().optional(),
  search: z.string().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
