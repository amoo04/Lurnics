export type ThemeId = "classic" | "modern" | "minimal";

export interface ThemeStyle {
  page: string;
  header: string;
  headerLink: string;
  announcement: string;
  heroSection: string;
  heroEyebrow: string;
  heroHeadline: string;
  heroSubtext: string;
  heroButton: string;
  sectionHeading: string;
  cardBorder: string;
  cardImageBg: string;
  productName: string;
  productPrice: string;
  footer: string;
}

export const THEMES: Record<ThemeId, ThemeStyle> = {
  classic: {
    page: "bg-white",
    header: "border-b border-gray-100 bg-white",
    headerLink: "text-gray-600 hover:text-gray-900",
    announcement: "bg-gray-900 text-white",
    heroSection: "bg-gray-50 text-center",
    heroEyebrow: "text-xs font-semibold uppercase tracking-wider text-orange-500",
    heroHeadline: "text-gray-900",
    heroSubtext: "text-gray-600",
    heroButton: "bg-gray-900 text-white hover:bg-black",
    sectionHeading: "text-gray-900",
    cardBorder: "border border-gray-100",
    cardImageBg: "bg-gray-50",
    productName: "text-gray-900",
    productPrice: "text-gray-500",
    footer: "border-t border-gray-100 bg-white text-gray-500",
  },
  modern: {
    page: "bg-gray-950",
    header: "border-b border-gray-800 bg-gray-950",
    headerLink: "text-gray-300 hover:text-white",
    announcement: "bg-indigo-600 text-white",
    heroSection: "bg-gradient-to-br from-gray-950 to-indigo-950 text-left",
    heroEyebrow: "text-xs font-bold uppercase tracking-widest text-indigo-400",
    heroHeadline: "text-white",
    heroSubtext: "text-gray-400",
    heroButton: "bg-indigo-600 text-white hover:bg-indigo-500",
    sectionHeading: "text-white",
    cardBorder: "border border-gray-800",
    cardImageBg: "bg-gray-900",
    productName: "text-white",
    productPrice: "text-gray-400",
    footer: "border-t border-gray-800 bg-gray-950 text-gray-500",
  },
  minimal: {
    page: "bg-white",
    header: "border-b border-black bg-white",
    headerLink: "text-black hover:opacity-60",
    announcement: "bg-white text-black border-b border-black",
    heroSection: "bg-white text-center",
    heroEyebrow: "text-xs uppercase tracking-[0.2em] text-gray-400",
    heroHeadline: "font-light tracking-tight text-black",
    heroSubtext: "text-gray-500",
    heroButton: "border border-black bg-white text-black hover:bg-black hover:text-white",
    sectionHeading: "font-light text-black",
    cardBorder: "border-0",
    cardImageBg: "bg-gray-100",
    productName: "text-black",
    productPrice: "text-gray-400",
    footer: "border-t border-black bg-white text-gray-500",
  },
};

export function getTheme(themeId: string | undefined): ThemeStyle {
  return THEMES[(themeId as ThemeId) ?? "classic"] ?? THEMES.classic;
}
