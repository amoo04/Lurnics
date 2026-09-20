import { apiDelete, apiPatch, apiPost } from "../../lib/api";
import { useApiGet, buildQuery } from "../../lib/useApi";
import type { CaseStudy, CreateCaseStudyInput, Industry, Paginated } from "../api/success-stories.types";

export function useSuccessStories() {
  return useApiGet<Paginated<CaseStudy>>(`/api/case-studies/admin${buildQuery({ limit: 100 })}`);
}

export function useIndustries() {
  return useApiGet<Paginated<Industry>>(`/api/industries${buildQuery({ limit: 100 })}`);
}

export function createCaseStudy(input: CreateCaseStudyInput) {
  return apiPost<CaseStudy>("/api/case-studies", input);
}

export function updateCaseStudy(id: string, input: Partial<CreateCaseStudyInput>) {
  return apiPatch<CaseStudy>(`/api/case-studies/${id}`, input);
}

export function deleteCaseStudy(id: string) {
  return apiDelete(`/api/case-studies/${id}`);
}
