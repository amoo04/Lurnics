import { and, desc, eq, like } from "drizzle-orm";
import { db } from "../../db/index.js";
import { projects, type NewProjectRow } from "../../db/schema.js";

export async function findProjects(
  status: string | undefined,
  clientId: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [];
  if (status) conditions.push(eq(projects.status, status));
  if (clientId) conditions.push(eq(projects.clientId, clientId));
  if (search) conditions.push(like(projects.projectName, `%${search}%`));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, total] = await Promise.all([
    db.query.projects.findMany({
      where,
      limit,
      offset,
      orderBy: desc(projects.createdAt),
      with: { client: true },
    }),
    db.$count(projects, where),
  ]);

  return { items, total };
}

export async function findProjectById(id: string) {
  return db.query.projects.findFirst({
    where: eq(projects.id, id),
    with: { client: true, members: true },
  });
}

export async function findProjectBySlug(slug: string) {
  return db.query.projects.findFirst({ where: eq(projects.slug, slug) });
}

export async function createProject(input: NewProjectRow) {
  const [row] = await db.insert(projects).values(input).returning();
  return row;
}

export async function updateProject(id: string, input: Partial<NewProjectRow>) {
  const [row] = await db.update(projects).set(input).where(eq(projects.id, id)).returning();
  return row;
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id));
}
