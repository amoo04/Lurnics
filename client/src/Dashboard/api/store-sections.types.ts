export type SectionType =
  | "header"
  | "announcement"
  | "hero"
  | "featured_collections"
  | "featured_products"
  | "testimonials"
  | "newsletter"
  | "footer";

export interface StoreSection {
  id: string;
  businessId: string;
  type: SectionType;
  sortOrder: number;
  visible: boolean;
  content: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
