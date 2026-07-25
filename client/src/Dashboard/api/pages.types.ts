export type PageStatus = "draft" | "published" | "archived";
export type PageType = "page" | "homepage" | "shop_page" | "collection_page";

export interface Page {
  id: string;
  businessId: string;
  title: string;
  slug: string;
  type: PageType;
  content: string;
  metaTitle: string | null;
  metaDescription: string | null;
  status: PageStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PageListResult {
  items: Page[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PageStats {
  totalPages: number;
  publishedPages: number;
  draftPages: number;
  archivedPages: number;
}

export interface CreatePageInput {
  title: string;
  slug?: string;
  type?: PageType;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  status?: PageStatus;
}

export type UpdatePageInput = Partial<CreatePageInput>;
