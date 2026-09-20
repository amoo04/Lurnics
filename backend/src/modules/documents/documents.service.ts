import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createDocument,
  deleteDocument,
  findDocumentById,
  findDocuments,
} from "./documents.repository.js";
import type { CreateDocumentInput } from "./documents.schema.js";

export async function listDocuments(query: {
  page?: string;
  limit?: string;
  clientId?: string;
  projectId?: string;
  search?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findDocuments(
    query.clientId,
    query.projectId,
    query.search,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function addDocument(uploadedBy: string, input: CreateDocumentInput) {
  return createDocument({ ...input, uploadedBy });
}

export async function removeDocument(id: string) {
  const existing = await findDocumentById(id);
  if (!existing) throw new NotFoundError("Document not found");
  await deleteDocument(id);
}
