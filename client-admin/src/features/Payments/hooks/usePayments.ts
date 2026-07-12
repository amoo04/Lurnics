import { apiDelete, apiPatch, apiPost } from "../../../lib/api";
import { buildQuery, useApiGet } from "../../../lib/useApi";
import type { CreatePaymentInput, Paginated, Payment } from "../api/payments.types";

export function usePayments(params: { page?: number; limit?: number; status?: string }) {
  const query = buildQuery({ page: params.page, limit: params.limit ?? 100, status: params.status });
  return useApiGet<Paginated<Payment>>(`/api/payments${query}`);
}

export function recordPayment(input: CreatePaymentInput) {
  return apiPost<Payment>("/api/payments", input);
}

export function updatePayment(id: string, input: Partial<CreatePaymentInput>) {
  return apiPatch<Payment>(`/api/payments/${id}`, input);
}

export function deletePayment(id: string) {
  return apiDelete(`/api/payments/${id}`);
}
