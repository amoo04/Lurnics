import { ConflictError, NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createSolution,
  deleteSolution,
  findSolutionById,
  findSolutionBySlug,
  findSolutions,
  updateSolution,
} from "./solutions.repository.js";
import type { CreateSolutionInput, UpdateSolutionInput } from "./solutions.schema.js";

export async function listSolutions(query: { page?: string; limit?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findSolutions(pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function getSolutionBySlug(slug: string) {
  const solution = await findSolutionBySlug(slug);
  if (!solution) throw new NotFoundError("Solution not found");
  return solution;
}

export async function addSolution(input: CreateSolutionInput) {
  const existing = await findSolutionBySlug(input.slug);
  if (existing) throw new ConflictError("Solution with this slug already exists");
  return createSolution(input);
}

export async function editSolution(id: string, input: UpdateSolutionInput) {
  const existing = await findSolutionById(id);
  if (!existing) throw new NotFoundError("Solution not found");
  return updateSolution(id, input);
}

export async function removeSolution(id: string) {
  const existing = await findSolutionById(id);
  if (!existing) throw new NotFoundError("Solution not found");
  await deleteSolution(id);
}
