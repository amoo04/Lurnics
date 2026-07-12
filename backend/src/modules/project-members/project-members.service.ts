import { ConflictError } from "../../middleware/error.js";
import { addMember, findMember, findMembersByProject, removeMember } from "./project-members.repository.js";
import type { AddProjectMemberInput } from "./project-members.schema.js";

export async function listProjectMembers(projectId: string) {
  return findMembersByProject(projectId);
}

export async function assignProjectMember(projectId: string, input: AddProjectMemberInput) {
  const existing = await findMember(projectId, input.userId);
  if (existing) throw new ConflictError("User is already a member of this project");
  return addMember({ projectId, ...input });
}

export async function unassignProjectMember(projectId: string, userId: string) {
  await removeMember(projectId, userId);
}
