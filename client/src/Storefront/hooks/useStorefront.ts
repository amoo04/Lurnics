import { apiGet, apiPost } from "../../lib/api";
import type {
  BlogListData,
  BlogPostPageData,
  CollectionPageData,
  ShopResult,
  StorefrontData,
  StorePageData,
} from "../api/storefront.types";

export function fetchStorefront(slug: string) {
  return apiGet<StorefrontData>(`/api/public/stores/${slug}`);
}

export function fetchShopProducts(
  slug: string,
  params: { page?: number; collectionSlug?: string } = {},
) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.collectionSlug) query.set("collectionSlug", params.collectionSlug);
  const qs = query.toString();
  return apiGet<ShopResult>(
    `/api/public/stores/${slug}/products${qs ? `?${qs}` : ""}`,
  );
}

export function fetchCollectionPage(slug: string, collectionSlug: string) {
  return apiGet<CollectionPageData>(
    `/api/public/stores/${slug}/collections/${collectionSlug}`,
  );
}

export function fetchStorePage(slug: string, pageSlug: string) {
  return apiGet<StorePageData>(`/api/public/stores/${slug}/pages/${pageSlug}`);
}

export function subscribeToNewsletter(
  slug: string,
  email: string,
  name?: string,
) {
  return apiPost<{ id: string; email: string }>(
    `/api/public/stores/${slug}/subscribe`,
    { email, name },
  );
}

export function fetchBlogList(slug: string, params: { page?: number } = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  const qs = query.toString();
  return apiGet<BlogListData>(
    `/api/public/stores/${slug}/blog${qs ? `?${qs}` : ""}`,
  );
}

export function fetchBlogPost(slug: string, postSlug: string) {
  return apiGet<BlogPostPageData>(
    `/api/public/stores/${slug}/blog/${postSlug}`,
  );
}
