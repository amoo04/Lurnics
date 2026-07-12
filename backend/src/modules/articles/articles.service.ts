import { ConflictError, NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createArticle,
  deleteArticle,
  findArticleById,
  findArticleBySlug,
  findArticles,
  findPublishedArticleBySlug,
  updateArticle,
} from "./articles.repository.js";
import type { CreateArticleInput, UpdateArticleInput } from "./articles.schema.js";

export async function listPublishedArticles(query: { page?: string; limit?: string }) {
  const pagination = parsePagination(query);
  const { items, total } = await findArticles("published", pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function listAllArticles(query: {
  page?: string;
  limit?: string;
  status?: string;
}) {
  const pagination = parsePagination(query);
  const { items, total } = await findArticles(query.status, pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function getPublishedArticleBySlug(slug: string) {
  const article = await findPublishedArticleBySlug(slug);
  if (!article) throw new NotFoundError("Article not found");
  return article;
}

export async function addArticle(input: CreateArticleInput) {
  const existing = await findArticleBySlug(input.slug);
  if (existing) throw new ConflictError("Article with this slug already exists");

  const publishedAt = input.status === "published" ? new Date().toISOString() : undefined;
  return createArticle({ ...input, publishedAt });
}

export async function editArticle(id: string, input: UpdateArticleInput) {
  const existing = await findArticleById(id);
  if (!existing) throw new NotFoundError("Article not found");

  const publishedAt =
    input.status === "published" && !existing.publishedAt
      ? new Date().toISOString()
      : undefined;

  return updateArticle(id, publishedAt ? { ...input, publishedAt } : input);
}

export async function removeArticle(id: string) {
  const existing = await findArticleById(id);
  if (!existing) throw new NotFoundError("Article not found");
  await deleteArticle(id);
}
