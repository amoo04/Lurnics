export type NavLinkType = "home" | "shop" | "collection" | "page" | "custom";

export interface NavItem {
  id: string;
  businessId: string;
  location: string;
  label: string;
  linkType: NavLinkType;
  targetSlug: string | null;
  customUrl: string | null;
  sortOrder: number;
  isVisible: boolean;
  createdAt: string;
}

export interface CreateNavItemInput {
  location?: string;
  label: string;
  linkType: NavLinkType;
  targetSlug?: string;
  customUrl?: string;
  isVisible?: boolean;
}

export type UpdateNavItemInput = Partial<CreateNavItemInput>;
