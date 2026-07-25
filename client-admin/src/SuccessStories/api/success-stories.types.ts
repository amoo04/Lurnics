export interface Industry {
  id: string;
  name: string;
  slug: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  industryId: string | null;
  industry: Industry | null;
  summary: string | null;
  content: string;
  liveUrl: string | null;
  featuredImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  publishedAt: string | null;
}

export interface CreateCaseStudyInput {
  title: string;
  slug: string;
  industryId?: string;
  summary?: string;
  content: string;
  liveUrl?: string;
  featuredImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  published?: boolean;
}

export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
