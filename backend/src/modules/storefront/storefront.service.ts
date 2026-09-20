import { NotFoundError } from "../../middleware/error.js";
import { parsePagination, paginatedResult } from "../../lib/pagination.js";
import { findBusinessBySlug } from "../platform/platform.repository.js";
import { findVisibleSections } from "../store-sections/store-sections.repository.js";
import { findVisibleItems } from "../navigation/navigation.repository.js";
import { findCollectionBySlug, getProductCounts } from "../collections/collections.repository.js";
import { findPublishedPageBySlug, incrementPageViews } from "../pages/pages.repository.js";
import {
  findPublishedBlogPostBySlug,
  findPublishedBlogPosts,
  incrementBlogPostViews,
} from "../blog/blog.repository.js";
import { createCustomer, findCustomerByEmail } from "../customers/customers.repository.js";
import { findActiveCollections, findFeaturedProducts, findShopProducts } from "./storefront.repository.js";

function parseContent(row: { content: string }) {
  try {
    return JSON.parse(row.content) as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function getBusinessOrThrow(slug: string) {
  const business = await findBusinessBySlug(slug);
  if (!business || business.status !== "active") throw new NotFoundError("Store not found");
  return business;
}

async function getPublicNavigation(businessId: string) {
  const items = await findVisibleItems(businessId, "main");
  return items.map((n) => ({
    id: n.id,
    label: n.label,
    linkType: n.linkType,
    targetSlug: n.targetSlug,
    customUrl: n.customUrl,
  }));
}

function publicBusiness(business: {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  currency: string;
  theme: string;
}) {
  return {
    id: business.id,
    name: business.name,
    slug: business.slug,
    logo: business.logo,
    currency: business.currency,
    theme: business.theme,
  };
}

export async function getStorefront(slug: string) {
  const business = await getBusinessOrThrow(slug);

  const [sections, navigation] = await Promise.all([
    findVisibleSections(business.id),
    getPublicNavigation(business.id),
  ]);
  const parsedSections = sections.map((s) => ({ id: s.id, type: s.type, content: parseContent(s) }));

  const needsCollections = parsedSections.some((s) => s.type === "featured_collections");
  const needsProducts = parsedSections.some((s) => s.type === "featured_products");

  const [collectionsList, featuredProducts] = await Promise.all([
    needsCollections ? findActiveCollections(business.id, 8) : Promise.resolve([]),
    needsProducts ? findFeaturedProducts(business.id, 8) : Promise.resolve([]),
  ]);

  const counts = collectionsList.length > 0 ? await getProductCounts(collectionsList.map((c) => c.id)) : {};
  const collectionsWithCounts = collectionsList.map((c) => ({ ...c, productCount: counts[c.id] ?? 0 }));

  return {
    business: publicBusiness(business),
    sections: parsedSections,
    navigation,
    collections: collectionsWithCounts,
    featuredProducts,
  };
}

export async function getShopProducts(
  slug: string,
  query: { page?: string; limit?: string; collectionSlug?: string },
) {
  const business = await getBusinessOrThrow(slug);

  let collectionId: string | undefined;
  if (query.collectionSlug) {
    const collection = await findCollectionBySlug(business.id, query.collectionSlug);
    if (!collection) throw new NotFoundError("Collection not found");
    collectionId = collection.id;
  }

  const pagination = parsePagination(query);
  const { items, total } = await findShopProducts(business.id, pagination.limit, pagination.offset, collectionId);
  return paginatedResult(items, total, pagination);
}

export async function getCollectionPage(slug: string, collectionSlug: string) {
  const business = await getBusinessOrThrow(slug);
  const collection = await findCollectionBySlug(business.id, collectionSlug);
  if (!collection || collection.status !== "active") throw new NotFoundError("Collection not found");

  const [{ items, total }, navigation] = await Promise.all([
    findShopProducts(business.id, 50, 0, collection.id),
    getPublicNavigation(business.id),
  ]);
  return { business: publicBusiness(business), navigation, collection, products: items, total };
}

export async function getStorePage(slug: string, pageSlug: string) {
  const business = await getBusinessOrThrow(slug);
  const page = await findPublishedPageBySlug(business.id, pageSlug);
  if (!page) throw new NotFoundError("Page not found");

  const navigation = await getPublicNavigation(business.id);
  await incrementPageViews(page.id);
  return { business: publicBusiness(business), navigation, page: { ...page, viewCount: page.viewCount + 1 } };
}

export async function getBlogList(slug: string, query: { page?: string; limit?: string }) {
  const business = await getBusinessOrThrow(slug);
  const pagination = parsePagination(query);

  const [{ items, total }, navigation] = await Promise.all([
    findPublishedBlogPosts(business.id, pagination.limit, pagination.offset),
    getPublicNavigation(business.id),
  ]);

  return { business: publicBusiness(business), navigation, ...paginatedResult(items, total, pagination) };
}

export async function getBlogPostPage(slug: string, postSlug: string) {
  const business = await getBusinessOrThrow(slug);
  const post = await findPublishedBlogPostBySlug(business.id, postSlug);
  if (!post) throw new NotFoundError("Blog post not found");

  const navigation = await getPublicNavigation(business.id);
  await incrementBlogPostViews(post.id);
  return { business: publicBusiness(business), navigation, post: { ...post, viewCount: post.viewCount + 1 } };
}

export async function subscribeToNewsletter(slug: string, email: string, name?: string) {
  const business = await getBusinessOrThrow(slug);
  const existing = await findCustomerByEmail(business.id, email);
  if (existing) return existing;

  return createCustomer({
    businessId: business.id,
    name: name ?? email.split("@")[0],
    email,
    tags: "newsletter",
  });
}
