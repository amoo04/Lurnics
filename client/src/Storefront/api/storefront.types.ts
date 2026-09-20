import type { PublicNavItem } from "./navigation.types";

export interface PublicBusiness {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  currency: string;
  theme: string;
}

export interface PublicProduct {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  collections: string | null;
}

export interface PublicCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  productCount: number;
}

export interface StoreSectionData {
  id: string;
  type: string;
  content: Record<string, unknown>;
}

export interface StorefrontData {
  business: PublicBusiness;
  sections: StoreSectionData[];
  navigation: PublicNavItem[];
  collections: PublicCollection[];
  featuredProducts: PublicProduct[];
}

export interface ShopResult {
  items: PublicProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CollectionPageData {
  business: PublicBusiness;
  navigation: PublicNavItem[];
  collection: PublicCollection;
  products: PublicProduct[];
  total: number;
}

export interface StorePageData {
  business: PublicBusiness;
  navigation: PublicNavItem[];
  page: {
    id: string;
    title: string;
    slug: string;
    content: string;
    viewCount: number;
  };
}

export interface BlogPostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: string | null;
}

export interface BlogListData {
  business: PublicBusiness;
  navigation: PublicNavItem[];
  items: BlogPostSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogPostPageData {
  business: PublicBusiness;
  navigation: PublicNavItem[];
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    coverImageUrl: string | null;
    publishedAt: string | null;
    viewCount: number;
  };
}
