import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import {
  requirementsGeneratorSubmissions,
  type NewRequirementsGeneratorSubmissionRow,
} from "../../db/schema.js";

export async function createRequirementsGeneratorSubmission(
  input: NewRequirementsGeneratorSubmissionRow,
) {
  const [row] = await db.insert(requirementsGeneratorSubmissions).values(input).returning();
  return row;
}

export async function findRequirementsGeneratorSubmissions(limit: number, offset: number) {
  const [items, total] = await Promise.all([
    db.query.requirementsGeneratorSubmissions.findMany({
      limit,
      offset,
      orderBy: desc(requirementsGeneratorSubmissions.createdAt),
    }),
    db.$count(requirementsGeneratorSubmissions),
  ]);

  return { items, total };
}

export async function findRequirementsGeneratorSubmissionById(id: string) {
  return db.query.requirementsGeneratorSubmissions.findFirst({
    where: eq(requirementsGeneratorSubmissions.id, id),
  });
}
