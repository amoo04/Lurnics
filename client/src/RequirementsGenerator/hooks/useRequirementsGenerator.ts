import { apiPost } from "../../lib/api";
import type {
  RequirementsGeneratorInput,
  RequirementsGeneratorSubmission,
} from "../api/requirements-generator.types";

export function submitRequirementsGenerator(input: RequirementsGeneratorInput) {
  return apiPost<RequirementsGeneratorSubmission>("/api/requirements-generator", input);
}
