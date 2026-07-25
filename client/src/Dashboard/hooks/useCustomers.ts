import { apiDelete, apiGet, apiPatch, apiPost } from "../../lib/api";
import type {
  Customer,
  CustomerListResult,
  CustomerStats,
  CreateCustomerInput,
  UpdateCustomerInput,
} from "../api/customers.types";

export function fetchCustomers(params: { status?: string; search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiGet<CustomerListResult>(`/api/platform/customers${qs ? `?${qs}` : ""}`);
}

export function fetchCustomerStats() {
  return apiGet<CustomerStats>("/api/platform/customers/stats");
}

export function createCustomer(input: CreateCustomerInput) {
  return apiPost<Customer>("/api/platform/customers", input);
}

export function updateCustomer(id: string, patch: UpdateCustomerInput) {
  return apiPatch<Customer>(`/api/platform/customers/${id}`, patch);
}

export function deleteCustomer(id: string) {
  return apiDelete<null>(`/api/platform/customers/${id}`);
}
