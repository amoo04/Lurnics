import { apiDelete, apiPatch, apiPost } from "../../../lib/api";
import { buildQuery, useApiGet } from "../../../lib/useApi";
import type { CreateInvoiceInput, Invoice, Paginated } from "../api/invoices.types";

export function useInvoices(params: { page?: number; limit?: number; search?: string; status?: string }) {
  const query = buildQuery({ page: params.page, limit: params.limit ?? 10, search: params.search, status: params.status });
  return useApiGet<Paginated<Invoice>>(`/api/invoices${query}`);
}

export function createInvoice(input: CreateInvoiceInput) {
  return apiPost<Invoice>("/api/invoices", input);
}

export function updateInvoice(id: string, input: Partial<CreateInvoiceInput>) {
  return apiPatch<Invoice>(`/api/invoices/${id}`, input);
}

export function deleteInvoice(id: string) {
  return apiDelete(`/api/invoices/${id}`);
}
