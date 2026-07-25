import { desc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { calculatorSubmissions, type NewCalculatorSubmissionRow } from "../../db/schema.js";

export async function createCalculatorSubmission(input: NewCalculatorSubmissionRow) {
  const [row] = await db.insert(calculatorSubmissions).values(input).returning();
  return row;
}

export async function findCalculatorSubmissions(limit: number, offset: number) {
  const [items, total] = await Promise.all([
    db.query.calculatorSubmissions.findMany({
      limit,
      offset,
      orderBy: desc(calculatorSubmissions.createdAt),
    }),
    db.$count(calculatorSubmissions),
  ]);

  return { items, total };
}

export async function findCalculatorSubmissionById(id: string) {
  return db.query.calculatorSubmissions.findFirst({ where: eq(calculatorSubmissions.id, id) });
}
