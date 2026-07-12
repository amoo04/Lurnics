import { ConflictError, NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createCaseStudy,
  deleteCaseStudy,
  findAllCaseStudies,
  findCaseStudyById,
  findCaseStudyBySlug,
  findCaseStudies,
  findPublishedCaseStudyBySlug,
  updateCaseStudy,
} from "./case-studies.repository.js";
import type { CreateCaseStudyInput, UpdateCaseStudyInput } from "./case-studies.schema.js";

export async function listPublishedCaseStudies(query: {
  page?: string;
  limit?: string;
  industryId?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findCaseStudies(
    query.industryId,
    pagination.limit,
    pagination.offset,
  );
  return paginatedResult(items, total, pagination);
}

export async function listAllCaseStudies(query: { page?: string; limit?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findAllCaseStudies(pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function getPublishedCaseStudyBySlug(slug: string) {
  const caseStudy = await findPublishedCaseStudyBySlug(slug);
  if (!caseStudy) throw new NotFoundError("Case study not found");
  return caseStudy;
}

export async function addCaseStudy(input: CreateCaseStudyInput) {
  const existing = await findCaseStudyBySlug(input.slug);
  if (existing) throw new ConflictError("Case study with this slug already exists");

  const { published, ...rest } = input;
  const publishedAt = published ? new Date().toISOString() : undefined;
  return createCaseStudy({ ...rest, publishedAt });
}

export async function editCaseStudy(id: string, input: UpdateCaseStudyInput) {
  const existing = await findCaseStudyById(id);
  if (!existing) throw new NotFoundError("Case study not found");

  const { published, ...rest } = input;
  const publishedAt =
    published && !existing.publishedAt ? new Date().toISOString() : undefined;

  return updateCaseStudy(id, publishedAt ? { ...rest, publishedAt } : rest);
}

export async function removeCaseStudy(id: string) {
  const existing = await findCaseStudyById(id);
  if (!existing) throw new NotFoundError("Case study not found");
  await deleteCaseStudy(id);
}
