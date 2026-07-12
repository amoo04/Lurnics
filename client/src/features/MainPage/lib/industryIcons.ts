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
  healthcare: { icon: Heart, iconBg: "bg-pink-500/20 text-pink-400" },
  education: { icon: GraduationCap, iconBg: "bg-blue-500/20 text-blue-400" },
  retail: { icon: ShoppingBag, iconBg: "bg-purple-500/20 text-purple-400" },
  logistics: { icon: Truck, iconBg: "bg-teal-500/20 text-teal-400" },
  finance: { icon: Landmark, iconBg: "bg-indigo-500/20 text-indigo-400" },
  "real-estate": { icon: Building2, iconBg: "bg-purple-500/20 text-purple-400" },
  manufacturing: { icon: Cog, iconBg: "bg-blue-500/20 text-blue-400" },
  "professional-services": { icon: Briefcase, iconBg: "bg-indigo-500/20 text-indigo-400" },
};

export const DEFAULT_INDUSTRY_ICON = { icon: Building2, iconBg: "bg-indigo-500/20 text-indigo-400" };
