import { z } from "zod";

export const addProjectMemberSchema = z.object({
  userId: z.string().min(1),
  assignedRole: z.string().min(1),
});

export type AddProjectMemberInput = z.infer<typeof addProjectMemberSchema>;
