import { useApiGet } from "../../lib/useApiGet";
import type { Paginated } from "../../lib/types";
import type { Solution } from "../api/solutions.types";

export function useSolutions() {
  return useApiGet<Paginated<Solution>>("/api/solutions?limit=100");
}

export function useSolutionBySlug(slug: string | undefined) {
  return useApiGet<Solution>(slug ? `/api/solutions/${slug}` : null);
}
