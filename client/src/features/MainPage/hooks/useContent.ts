import { useEffect, useState } from "react";
import { apiGet, apiPost, ApiError } from "../../../lib/api";
import type {
  Article,
  CaseStudy,
  CreateLeadInput,
  Industry,
  Paginated,
  Solution,
} from "../api/main.types";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApiGet<T>(path: string | null): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({ data: null, loading: !!path, error: null });

  useEffect(() => {
    if (!path) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    apiGet<T>(path)
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: err instanceof ApiError ? err.message : "Something went wrong",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}

export function useIndustries() {
  return useApiGet<Paginated<Industry>>("/api/industries?limit=100");
}

export function useSolutions() {
  return useApiGet<Paginated<Solution>>("/api/solutions?limit=100");
}

export function useSolutionBySlug(slug: string | undefined) {
  return useApiGet<Solution>(slug ? `/api/solutions/${slug}` : null);
}

export function useCaseStudies(industryId?: string) {
  const query = industryId ? `?industryId=${industryId}&limit=100` : "?limit=100";
  return useApiGet<Paginated<CaseStudy>>(`/api/case-studies${query}`);
}

export function useCaseStudyBySlug(slug: string | undefined) {
  return useApiGet<CaseStudy>(slug ? `/api/case-studies/${slug}` : null);
}

export function useArticles() {
  return useApiGet<Paginated<Article>>("/api/articles?limit=100");
}

export function useArticleBySlug(slug: string | undefined) {
  return useApiGet<Article>(slug ? `/api/articles/${slug}` : null);
}

export async function submitLead(input: CreateLeadInput) {
  return apiPost("/api/leads", input);
}
