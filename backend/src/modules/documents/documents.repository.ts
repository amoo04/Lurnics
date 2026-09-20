import { and, desc, eq, like } from "drizzle-orm";
import { db } from "../../db/index.js";
import { documents, type NewDocumentRow } from "../../db/schema.js";

export async function findDocuments(
  clientId: string | undefined,
  projectId: string | undefined,
  search: string | undefined,
  limit: number,
  offset: number,
) {
  const conditions = [];
  if (clientId) conditions.push(eq(documents.clientId, clientId));
  if (projectId) conditions.push(eq(documents.projectId, projectId));
  if (search) conditions.push(like(documents.documentName, `%${search}%`));
  const where = conditions.length ? and(...conditions) : undefined;

  const [items, total] = await Promise.all([
    db.query.documents.findMany({
      where,
      limit,
      offset,
      orderBy: desc(documents.uploadedAt),
      with: { client: true, project: true, uploader: { columns: { passwordHash: false } } },
    }),
    db.$count(documents, where),
  ]);

  return { items, total };
}

export async function findDocumentById(id: string) {
  return db.query.documents.findFirst({ where: eq(documents.id, id) });
}

export async function createDocument(input: NewDocumentRow) {
  const [row] = await db.insert(documents).values(input).returning();
  return row;
}

export async function deleteDocument(id: string) {
  await db.delete(documents).where(eq(documents.id, id));
}
