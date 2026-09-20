import { ConflictError, NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createIndustry,
  deleteIndustry,
  findIndustries,
  findIndustryById,
  findIndustryBySlug,
  updateIndustry,
} from "./industries.repository.js";
import type { CreateIndustryInput, UpdateIndustryInput } from "./industries.schema.js";

export async function listIndustries(query: { page?: string; limit?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findIndustries(pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function getIndustryBySlug(slug: string) {
  const industry = await findIndustryBySlug(slug);
  if (!industry) throw new NotFoundError("Industry not found");
  return industry;
}

export async function addIndustry(input: CreateIndustryInput) {
  const existing = await findIndustryBySlug(input.slug);
  if (existing) throw new ConflictError("Industry with this slug already exists");
  return createIndustry(input);
}

export async function editIndustry(id: string, input: UpdateIndustryInput) {
  const existing = await findIndustryById(id);
  if (!existing) throw new NotFoundError("Industry not found");
  return updateIndustry(id, input);
}

export async function removeIndustry(id: string) {
  const existing = await findIndustryById(id);
  if (!existing) throw new NotFoundError("Industry not found");
  await deleteIndustry(id);
}
