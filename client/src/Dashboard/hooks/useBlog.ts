import { apiDelete, apiGet, apiPatch, apiPost } from "../../lib/api";
import type {
  BlogPost,
  BlogPostListResult,
  BlogStats,
  CreateBlogPostInput,
  UpdateBlogPostInput,
} from "../api/blog.types";

export function fetchBlogPosts(params: { status?: string; search?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params.status) query.set("status", params.status);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));

  const qs = query.toString();
  return apiGet<BlogPostListResult>(`/api/platform/blog${qs ? `?${qs}` : ""}`);
}

export function fetchBlogStats() {
  return apiGet<BlogStats>("/api/platform/blog/stats");
}

export function createBlogPost(input: CreateBlogPostInput) {
  return apiPost<BlogPost>("/api/platform/blog", input);
}

export function updateBlogPost(id: string, patch: UpdateBlogPostInput) {
  return apiPatch<BlogPost>(`/api/platform/blog/${id}`, patch);
}

export function deleteBlogPost(id: string) {
  return apiDelete<null>(`/api/platform/blog/${id}`);
}
