export interface Paginated<T> {
  items: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  status: string;
  publishedAt: string | null;
  createdAt: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  industryId: string | null;
  summary: string | null;
  content: string;
  featuredImage: string | null;
  publishedAt: string | null;
  industry: Industry | null;
}

export interface Solution {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CreateLeadInput {
  companyName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  budgetRange?: string;
  source?: string;
  service?: string;
}
