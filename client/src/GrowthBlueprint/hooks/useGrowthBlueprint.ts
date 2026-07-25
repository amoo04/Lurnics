import { apiPost } from "../../lib/api";
import type { GrowthBlueprintInput, GrowthBlueprintSubmission } from "../api/growth-blueprint.types";

export function submitGrowthBlueprint(input: GrowthBlueprintInput) {
  return apiPost<GrowthBlueprintSubmission>("/api/growth-blueprint", input);
}
