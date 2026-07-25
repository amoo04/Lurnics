import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { NotFoundError } from "../../middleware/error.js";
import { submitLead } from "../leads/leads.service.js";
import {
  createRequirementsGeneratorSubmission,
  findRequirementsGeneratorSubmissionById,
  findRequirementsGeneratorSubmissions,
} from "./requirements-generator.repository.js";
import type { CreateRequirementsGeneratorInput } from "./requirements-generator.schema.js";

export async function submitRequirementsGenerator(input: CreateRequirementsGeneratorInput) {
  const lead = await submitLead({
    companyName: input.companyName || input.contactName,
    contactPerson: input.contactName,
    email: input.email,
    budgetRange: input.budgetRange,
    source: "requirements-generator",
    service: input.projectType,
  });

  const submission = await createRequirementsGeneratorSubmission({
    leadId: lead.id,
    companyName: input.companyName,
    contactName: input.contactName,
    email: input.email,
    projectType: input.projectType,
    goal: input.goal,
    mustHaveFeatures: JSON.stringify(input.mustHaveFeatures),
    niceToHaveFeatures: input.niceToHaveFeatures ? JSON.stringify(input.niceToHaveFeatures) : undefined,
    targetUsers: input.targetUsers,
    timeline: input.timeline,
    budgetRange: input.budgetRange,
  });

  return submission;
}

export async function listRequirementsGeneratorSubmissions(query: { page?: string; limit?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findRequirementsGeneratorSubmissions(pagination.limit, pagination.offset);

  const parsed = items.map((item) => ({
    ...item,
    mustHaveFeatures: JSON.parse(item.mustHaveFeatures) as string[],
    niceToHaveFeatures: item.niceToHaveFeatures ? (JSON.parse(item.niceToHaveFeatures) as string[]) : [],
  }));

  return paginatedResult(parsed, total, pagination);
}

export async function getRequirementsGeneratorSubmission(id: string) {
  const submission = await findRequirementsGeneratorSubmissionById(id);
  if (!submission) throw new NotFoundError("Requirements generator submission not found");
  return {
    ...submission,
    mustHaveFeatures: JSON.parse(submission.mustHaveFeatures) as string[],
    niceToHaveFeatures: submission.niceToHaveFeatures
      ? (JSON.parse(submission.niceToHaveFeatures) as string[])
      : [],
  };
}
