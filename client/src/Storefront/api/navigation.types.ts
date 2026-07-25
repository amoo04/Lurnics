export type NavLinkType = "home" | "shop" | "collection" | "page" | "custom";

export interface PublicNavItem {
  id: string;
  label: string;
  linkType: NavLinkType;
  targetSlug: string | null;
  customUrl: string | null;
}

export function resolveNavItemUrl(item: PublicNavItem, base: string): string {
  switch (item.linkType) {
    case "home":
      return base;
    case "shop":
      return `${base}/shop`;
    case "collection":
      return `${base}/collections/${item.targetSlug ?? ""}`;
    case "page":
      return `${base}/pages/${item.targetSlug ?? ""}`;
    case "custom":
    default:
      return item.customUrl?.startsWith("/") ? `${base}${item.customUrl}` : (item.customUrl ?? base);
  }
}
