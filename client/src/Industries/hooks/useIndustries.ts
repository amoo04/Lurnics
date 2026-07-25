import { useApiGet } from "../../lib/useApiGet";
import type { Paginated } from "../../lib/types";
import type { Industry } from "../api/industries.types";

export function useIndustries() {
  return useApiGet<Paginated<Industry>>("/api/industries?limit=100");
}
