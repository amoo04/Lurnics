import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { projectMembers, type NewProjectMemberRow } from "../../db/schema.js";

export async function findMembersByProject(projectId: string) {
  return db.query.projectMembers.findMany({
    where: eq(projectMembers.projectId, projectId),
    with: { user: { columns: { passwordHash: false } } },
  });
}

export async function findMember(projectId: string, userId: string) {
  return db.query.projectMembers.findFirst({
    where: and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)),
  });
}

export async function addMember(input: NewProjectMemberRow) {
  const [row] = await db.insert(projectMembers).values(input).returning();
  return row;
}

export async function removeMember(projectId: string, userId: string) {
  await db
    .delete(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.userId, userId)));
}
