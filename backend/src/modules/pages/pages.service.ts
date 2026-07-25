import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createPage,
  deletePage,
  findPageBySlug,
  findPageById,
  findPages,
  getPageSummary,
  updatePage,
} from "./pages.repository.js";
import type { CreatePageInput, UpdatePageInput } from "./pages.schema.js";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(businessId: string, title: string): Promise<string> {
  const base = slugify(title) || "page";
  let slug = base;
  let suffix = 2;

  while (await findPageBySlug(businessId, slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function addPage(businessId: string, input: CreatePageInput) {
  const slug = input.slug ? slugify(input.slug) : await generateUniqueSlug(businessId, input.title);

  return createPage({
    businessId,
    title: input.title,
    slug,
    type: input.type ?? "page",
    content: input.content ?? "",
    metaTitle: input.metaTitle,
    metaDescription: input.metaDescription,
    status: input.status ?? "draft",
  });
}

export async function listPages(
  businessId: string,
  query: { page?: string; limit?: string; status?: string; search?: string },
) {
  const pagination = parsePagination(query);
  const { items, total } = await findPages(businessId, query.status, query.search, pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function getPage(businessId: string, id: string) {
  const page = await findPageById(businessId, id);
  if (!page) throw new NotFoundError("Page not found");
  return page;
}

export async function editPage(businessId: string, id: string, input: UpdatePageInput) {
  await getPage(businessId, id);

  // updatedAt is kept in sync by the pages_set_updated_at trigger (see
  // db/index.ts TABLES_WITH_UPDATED_AT) - not set manually here to avoid
  // the SQLite-format-vs-ISO-string mismatch that bit carts.lastActivityAt.
  const patch: Record<string, unknown> = { ...input };
  if (input.slug) patch.slug = slugify(input.slug);

  return updatePage(businessId, id, patch);
}

export async function removePage(businessId: string, id: string) {
  await getPage(businessId, id);
  await deletePage(businessId, id);
}

export async function getPageStats(businessId: string) {
  const summary = await getPageSummary(businessId);

  return {
    totalPages: summary?.totalPages ?? 0,
    publishedPages: summary?.publishedPages ?? 0,
    draftPages: summary?.draftPages ?? 0,
    archivedPages: summary?.archivedPages ?? 0,
  };
}
