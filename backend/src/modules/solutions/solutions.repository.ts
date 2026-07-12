import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { solutions, type NewSolutionRow } from "../../db/schema.js";

export async function findSolutions(limit: number, offset: number) {
  const [items, total] = await Promise.all([
    db.query.solutions.findMany({ limit, offset, orderBy: (t, { asc }) => asc(t.name) }),
    db.$count(solutions),
  ]);

  return { items, total };
}

export async function findSolutionBySlug(slug: string) {
  return db.query.solutions.findFirst({ where: eq(solutions.slug, slug) });
}

export async function findSolutionById(id: string) {
  return db.query.solutions.findFirst({ where: eq(solutions.id, id) });
}

export async function createSolution(input: NewSolutionRow) {
  const [row] = await db.insert(solutions).values(input).returning();
  return row;
}

export async function updateSolution(id: string, input: Partial<NewSolutionRow>) {
  const [row] = await db.update(solutions).set(input).where(eq(solutions.id, id)).returning();
  return row;
}

export async function deleteSolution(id: string) {
  await db.delete(solutions).where(eq(solutions.id, id));
}
