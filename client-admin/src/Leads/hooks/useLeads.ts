import { apiDelete, apiPatch, apiPost } from "../../lib/api";
import { useApiGet } from "../../lib/useApi";
import type { CreateLeadInput, Lead, LeadStatus, Paginated } from "../api/leads.types";

export function useLeads() {
  return useApiGet<Paginated<Lead>>("/api/leads?limit=100");
}

export function useLead(id: string | undefined) {
  return useApiGet<Lead>(id ? `/api/leads/${id}` : null);
}

export function createLead(input: CreateLeadInput) {
  return apiPost<Lead>("/api/leads", input);
}

export function updateLeadStatus(id: string, status: LeadStatus) {
  return apiPatch<Lead>(`/api/leads/${id}`, { status });
}

export function deleteLead(id: string) {
  return apiDelete(`/api/leads/${id}`);
}
