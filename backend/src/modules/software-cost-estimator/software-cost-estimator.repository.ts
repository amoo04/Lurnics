import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
  softwareCostEstimatorSubmissions,
  type NewSoftwareCostEstimatorSubmissionRow,
} from "../../db/schema.js";

export async function createSoftwareCostEstimatorSubmission(
  input: NewSoftwareCostEstimatorSubmissionRow,
) {
  const [row] = await db.insert(softwareCostEstimatorSubmissions).values(input).returning();
  return row;
}

export async function findSoftwareCostEstimatorSubmissions(limit: number, offset: number) {
  const [items, total] = await Promise.all([
    db.query.softwareCostEstimatorSubmissions.findMany({
      limit,
      offset,
      orderBy: desc(softwareCostEstimatorSubmissions.createdAt),
    }),
    db.$count(softwareCostEstimatorSubmissions),
  ]);

  return { items, total };
}

export async function findSoftwareCostEstimatorSubmissionById(id: string) {
  return db.query.softwareCostEstimatorSubmissions.findFirst({
    where: eq(softwareCostEstimatorSubmissions.id, id),
  });
}
