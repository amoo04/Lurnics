import { useApiGet, buildQuery } from "../../lib/useApi";
import type { GrowthBlueprintSubmission, Paginated } from "../api/growth-blueprint.types";

export function useGrowthBlueprintSubmissions() {
  return useApiGet<Paginated<GrowthBlueprintSubmission>>(
    `/api/growth-blueprint${buildQuery({ limit: 100 })}`,
  );
}
