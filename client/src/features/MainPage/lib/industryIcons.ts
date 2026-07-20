import {
  Heart,
  GraduationCap,
  ShoppingBag,
  Truck,
  Landmark,
  Building2,
  Cog,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export const ICONS_BY_SLUG: Record<string, { icon: LucideIcon; iconBg: string }> = {
  healthcare: { icon: Heart, iconBg: "bg-pink-50 text-pink-500" },
  education: { icon: GraduationCap, iconBg: "bg-blue-50 text-blue-500" },
  retail: { icon: ShoppingBag, iconBg: "bg-orange-50 text-orange-500" },
  logistics: { icon: Truck, iconBg: "bg-teal-50 text-teal-500" },
  finance: { icon: Landmark, iconBg: "bg-orange-50 text-orange-500" },
  "real-estate": { icon: Building2, iconBg: "bg-orange-50 text-orange-500" },
  manufacturing: { icon: Cog, iconBg: "bg-blue-50 text-blue-500" },
  "professional-services": { icon: Briefcase, iconBg: "bg-orange-50 text-orange-500" },
};

export const DEFAULT_INDUSTRY_ICON = { icon: Building2, iconBg: "bg-orange-50 text-orange-500" };
