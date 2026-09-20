import { useApiGet } from "../../lib/useApiGet";
import type { Paginated } from "../../lib/types";
import type { Article } from "../api/insights.types";

export function useArticles() {
  return useApiGet<Paginated<Article>>("/api/articles?limit=100");
}

export function useArticleBySlug(slug: string | undefined) {
  return useApiGet<Article>(slug ? `/api/articles/${slug}` : null);
}
