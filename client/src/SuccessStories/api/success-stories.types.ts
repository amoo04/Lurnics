import type { Industry } from "../../Industries/api/industries.types";

export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  industryId: string | null;
  summary: string | null;
  content: string;
  liveUrl: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  industry: Industry | null;
}
