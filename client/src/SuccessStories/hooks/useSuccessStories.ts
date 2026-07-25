import { useApiGet } from "../../lib/useApiGet";
import type { Paginated } from "../../lib/types";
import type { CaseStudy } from "../api/success-stories.types";

export function useCaseStudies(industryId?: string) {
  const query = industryId ? `?industryId=${industryId}&limit=100` : "?limit=100";
  return useApiGet<Paginated<CaseStudy>>(`/api/case-studies${query}`);
}

export function useCaseStudyBySlug(slug: string | undefined) {
  return useApiGet<CaseStudy>(slug ? `/api/case-studies/${slug}` : null);
}
