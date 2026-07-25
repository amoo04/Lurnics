import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { NotFoundError } from "../../middleware/error.js";
import { submitLead } from "../leads/leads.service.js";
import {
  createGrowthBlueprintSubmission,
  findGrowthBlueprintSubmissionById,
  findGrowthBlueprintSubmissions,
} from "./growth-blueprint.repository.js";
import type { CreateGrowthBlueprintInput } from "./growth-blueprint.schema.js";

export async function submitGrowthBlueprint(input: CreateGrowthBlueprintInput) {
  const lead = await submitLead({
    companyName: input.companyName,
    contactPerson: input.contactName,
    email: input.email,
    phone: input.phone,
    budgetRange: input.monthlyBudget,
    source: "growth-blueprint-tool",
    service: "Growth Blueprint",
  });

  const submission = await createGrowthBlueprintSubmission({
    leadId: lead.id,
    companyName: input.companyName,
    contactName: input.contactName,
    email: input.email,
    phone: input.phone,
    website: input.website,
    industry: input.industry,
    country: input.country,
    employees: input.employees,
    revenueRange: input.revenueRange,
    yearsInBusiness: input.yearsInBusiness,
    businessModel: input.businessModel,
    goals: JSON.stringify(input.goals),
    currentChannels: input.currentChannels ? JSON.stringify(input.currentChannels) : undefined,
    monthlyBudget: input.monthlyBudget,
    hasWebsite: input.hasWebsite ?? false,
    hasLandingPages: input.hasLandingPages ?? false,
    hasCrm: input.hasCrm ?? false,
    hasEmailAutomation: input.hasEmailAutomation ?? false,
    hasAnalytics: input.hasAnalytics ?? false,
    challenges: JSON.stringify(input.challenges),
  });

  return submission;
}

export async function listGrowthBlueprintSubmissions(query: {
  page?: string;
  limit?: string;
  status?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findGrowthBlueprintSubmissions(
    query.status,
    pagination.limit,
    pagination.offset,
  );

  const parsed = items.map((item) => ({
    ...item,
    goals: JSON.parse(item.goals) as string[],
    currentChannels: item.currentChannels ? (JSON.parse(item.currentChannels) as string[]) : [],
    challenges: JSON.parse(item.challenges) as string[],
  }));

  return paginatedResult(parsed, total, pagination);
}

export async function getGrowthBlueprintSubmission(id: string) {
  const submission = await findGrowthBlueprintSubmissionById(id);
  if (!submission) throw new NotFoundError("Growth blueprint submission not found");
  return {
    ...submission,
    goals: JSON.parse(submission.goals) as string[],
    currentChannels: submission.currentChannels
      ? (JSON.parse(submission.currentChannels) as string[])
      : [],
    challenges: JSON.parse(submission.challenges) as string[],
  };
}
