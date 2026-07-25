import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { growthBlueprintSubmissions, type NewGrowthBlueprintSubmissionRow } from "../../db/schema.js";

export async function createGrowthBlueprintSubmission(input: NewGrowthBlueprintSubmissionRow) {
  const [row] = await db.insert(growthBlueprintSubmissions).values(input).returning();
  return row;
}

export async function findGrowthBlueprintSubmissions(
  status: string | undefined,
  limit: number,
  offset: number,
) {
  const where = status ? eq(growthBlueprintSubmissions.status, status) : undefined;

  const [items, total] = await Promise.all([
    db.query.growthBlueprintSubmissions.findMany({
      where,
      limit,
      offset,
      orderBy: desc(growthBlueprintSubmissions.createdAt),
    }),
    db.$count(growthBlueprintSubmissions, where),
  ]);

  return { items, total };
}

export async function findGrowthBlueprintSubmissionById(id: string) {
  return db.query.growthBlueprintSubmissions.findFirst({
    where: eq(growthBlueprintSubmissions.id, id),
  });
}
