import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { NotFoundError } from "../../middleware/error.js";
import { submitLead } from "../leads/leads.service.js";
import {
  createSoftwareCostEstimatorSubmission,
  findSoftwareCostEstimatorSubmissionById,
  findSoftwareCostEstimatorSubmissions,
} from "./software-cost-estimator.repository.js";
import type { CreateSoftwareCostEstimatorInput } from "./software-cost-estimator.schema.js";

export async function submitSoftwareCostEstimator(input: CreateSoftwareCostEstimatorInput) {
  const lead = await submitLead({
    companyName: input.companyName || input.contactName,
    contactPerson: input.contactName,
    email: input.email,
    budgetRange: input.budgetRange,
    source: "software-cost-estimator",
    service: input.projectType,
  });

  const submission = await createSoftwareCostEstimatorSubmission({
    leadId: lead.id,
    companyName: input.companyName,
    contactName: input.contactName,
    email: input.email,
    projectType: input.projectType,
    platforms: JSON.stringify(input.platforms),
    features: JSON.stringify(input.features),
    needsDesign: input.needsDesign ?? false,
    timeline: input.timeline,
    budgetRange: input.budgetRange,
  });

  return submission;
}

export async function listSoftwareCostEstimatorSubmissions(query: { page?: string; limit?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findSoftwareCostEstimatorSubmissions(pagination.limit, pagination.offset);

  const parsed = items.map((item) => ({
    ...item,
    platforms: JSON.parse(item.platforms) as string[],
    features: JSON.parse(item.features) as string[],
  }));

  return paginatedResult(parsed, total, pagination);
}

export async function getSoftwareCostEstimatorSubmission(id: string) {
  const submission = await findSoftwareCostEstimatorSubmissionById(id);
  if (!submission) throw new NotFoundError("Software cost estimator submission not found");
  return {
    ...submission,
    platforms: JSON.parse(submission.platforms) as string[],
    features: JSON.parse(submission.features) as string[],
  };
}
