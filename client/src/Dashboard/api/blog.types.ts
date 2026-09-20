export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  businessId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  status: BlogPostStatus;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostListResult {
  items: BlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BlogStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

export interface CreateBlogPostInput {
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  coverImageUrl?: string;
  status?: BlogPostStatus;
}

export type UpdateBlogPostInput = Partial<CreateBlogPostInput>;
