import { apiDelete, apiPost } from "../../../lib/api";
import { buildQuery, useApiGet } from "../../../lib/useApi";
import type { CreateDocumentInput, Document, Paginated } from "../api/documents.types";

export function useDocuments(params: {
  page?: number;
  limit?: number;
  search?: string;
  clientId?: string;
  projectId?: string;
}) {
  const query = buildQuery({
    page: params.page,
    limit: params.limit ?? 10,
    search: params.search,
    clientId: params.clientId,
    projectId: params.projectId,
  });
  return useApiGet<Paginated<Document>>(`/api/documents${query}`);
}

export function createDocument(input: CreateDocumentInput) {
  return apiPost<Document>("/api/documents", input);
}

export function deleteDocument(id: string) {
  return apiDelete(`/api/documents/${id}`);
}
