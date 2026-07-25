import { apiPost } from "../../lib/api";
import type {
  SoftwareCostEstimatorInput,
  SoftwareCostEstimatorSubmission,
} from "../api/software-cost-estimator.types";

export function submitSoftwareCostEstimator(input: SoftwareCostEstimatorInput) {
  return apiPost<SoftwareCostEstimatorSubmission>("/api/software-cost-estimator", input);
}
