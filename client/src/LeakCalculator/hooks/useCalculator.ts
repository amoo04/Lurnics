import { apiPost } from "../../lib/api";
import type { CalculatorInput, CalculatorSubmission } from "../api/calculator.types";

export function submitCalculatorResult(input: CalculatorInput) {
  return apiPost<CalculatorSubmission>("/api/calculator", input);
}
