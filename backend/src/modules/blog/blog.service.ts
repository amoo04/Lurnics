import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import {
  createBlogPost,
  deleteBlogPost,
  findBlogPostBySlug,
  findBlogPostById,
  findBlogPosts,
  getBlogSummary,
  updateBlogPost,
} from "./blog.repository.js";
import type { CreateBlogPostInput, UpdateBlogPostInput } from "./blog.schema.js";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(businessId: string, title: string): Promise<string> {
  const base = slugify(title) || "post";
  let slug = base;
  let suffix = 2;

  while (await findBlogPostBySlug(businessId, slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function addBlogPost(businessId: string, input: CreateBlogPostInput) {
  const slug = input.slug ? slugify(input.slug) : await generateUniqueSlug(businessId, input.title);
  const status = input.status ?? "draft";

  return createBlogPost({
    businessId,
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content ?? "",
    coverImageUrl: input.coverImageUrl,
    status,
    publishedAt: status === "published" ? new Date().toISOString() : null,
  });
}

export async function listBlogPosts(
  businessId: string,
  query: { page?: string; limit?: string; status?: string; search?: string },
) {
  const pagination = parsePagination(query);
  const { items, total } = await findBlogPosts(businessId, query.status, query.search, pagination.limit, pagination.offset);
  return paginatedResult(items, total, pagination);
}

export async function getBlogPost(businessId: string, id: string) {
  const post = await findBlogPostById(businessId, id);
  if (!post) throw new NotFoundError("Blog post not found");
  return post;
}

export async function editBlogPost(businessId: string, id: string, input: UpdateBlogPostInput) {
  const existing = await getBlogPost(businessId, id);

  const patch: Record<string, unknown> = { ...input };
  if (input.slug) patch.slug = slugify(input.slug);
  if (input.status === "published" && existing.status !== "published") {
    patch.publishedAt = new Date().toISOString();
  }

  return updateBlogPost(businessId, id, patch);
}

export async function removeBlogPost(businessId: string, id: string) {
  await getBlogPost(businessId, id);
  await deleteBlogPost(businessId, id);
}

export async function getBlogStats(businessId: string) {
  const summary = await getBlogSummary(businessId);

  return {
    totalPosts: summary?.totalPosts ?? 0,
    publishedPosts: summary?.publishedPosts ?? 0,
    draftPosts: summary?.draftPosts ?? 0,
    totalViews: summary?.totalViews ?? 0,
  };
}
