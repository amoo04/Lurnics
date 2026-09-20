import { useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  Activity,
  Lightbulb,
  Store,
  ShoppingCart,
  Package,
  Users,
  Tag,
  Gift,
  Boxes,
  FolderOpen,
  Globe2,
  LayoutTemplate,
  FileText,
  Menu as MenuIcon,
  Palette,
  Newspaper,
  Globe,
  Search,
  Megaphone,
  Calendar,
  Mail,
  Ticket,
  BadgePercent,
  AlertCircle,
  Share2,
  BarChart3,
  TrendingUp,
  DollarSign,
  CreditCard,
  Receipt,
  Percent,
  Banknote,
  UserPlus,
  LifeBuoy,
  Star,
  UsersRound,
  Zap,
  Bell,
  Plug,
  Settings as SettingsIcon,
  ShieldCheck,
  LogOut,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { useDashboardAuth } from "../context/DashboardAuthContext";

interface NavLeaf {
  label: string;
  path: string | null;
  icon: LucideIcon;
}

interface NavSection {
  title: string;
  icon: LucideIcon;
  items: NavLeaf[];
}

const TOP_LEVEL: NavLeaf = { label: "Dashboard", path: "/portal", icon: LayoutDashboard };

const SECTIONS: NavSection[] = [
  {
    title: "Growth",
    icon: Compass,
    items: [
      { label: "Growth Blueprint", path: "/growth-blueprint", icon: Compass },
      { label: "Business Health", path: null, icon: Activity },
      { label: "Recommendations", path: null, icon: Lightbulb },
    ],
  },
  {
    title: "Commerce",
    icon: Store,
    items: [
      { label: "Orders", path: "/portal/orders", icon: ShoppingCart },
      { label: "Products", path: "/portal/products", icon: Package },
      { label: "Collections", path: "/portal/collections", icon: FolderOpen },
      { label: "Customers", path: "/portal/customers", icon: Users },
      { label: "Discounts", path: "/portal/discounts", icon: Tag },
      { label: "Gift Cards", path: "/portal/gift-cards", icon: Gift },
      { label: "Inventory", path: "/portal/inventory", icon: Boxes },
    ],
  },
  {
    title: "Website",
    icon: Globe2,
    items: [
      { label: "Store Builder", path: "/portal/store-builder", icon: LayoutTemplate },
      { label: "Pages", path: "/portal/pages", icon: FileText },
      { label: "Navigation", path: "/portal/navigation", icon: MenuIcon },
      { label: "Themes", path: "/portal/themes", icon: Palette },
      { label: "Blog", path: "/portal/blog", icon: Newspaper },
      { label: "Domains", path: "/portal/domains", icon: Globe },
      { label: "SEO", path: "/portal/seo", icon: Search },
    ],
  },
  {
    title: "Marketing",
    icon: Megaphone,
    items: [
      { label: "Campaign Planner", path: null, icon: Calendar },
      { label: "Email Marketing", path: "/portal/email-marketing", icon: Mail },
      { label: "Email Templates", path: "/portal/email-templates", icon: Newspaper },
      { label: "Coupons", path: null, icon: Ticket },
      { label: "Promotions", path: null, icon: BadgePercent },
      { label: "Abandoned Cart", path: "/portal/abandoned-cart", icon: AlertCircle },
      { label: "Social Media", path: null, icon: Share2 },
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    items: [
      { label: "Overview", path: null, icon: BarChart3 },
      { label: "Sales", path: null, icon: TrendingUp },
      { label: "Customers", path: null, icon: Users },
      { label: "Traffic", path: null, icon: Activity },
      { label: "Products", path: null, icon: Package },
      { label: "Marketing", path: null, icon: Megaphone },
    ],
  },
  {
    title: "Finance",
    icon: DollarSign,
    items: [
      { label: "Payments", path: null, icon: CreditCard },
      { label: "Transactions", path: null, icon: Receipt },
      { label: "Invoices", path: null, icon: FileText },
      { label: "Taxes", path: null, icon: Percent },
      { label: "Payouts", path: null, icon: Banknote },
    ],
  },
  {
    title: "CRM",
    icon: UsersRound,
    items: [
      { label: "Leads", path: null, icon: UserPlus },
      { label: "Customers", path: null, icon: Users },
      { label: "Support", path: null, icon: LifeBuoy },
      { label: "Reviews", path: null, icon: Star },
    ],
  },
  {
    title: "Operations",
    icon: SettingsIcon,
    items: [
      { label: "Team", path: null, icon: UsersRound },
      { label: "Automation", path: null, icon: Zap },
      { label: "Notifications", path: null, icon: Bell },
      { label: "Integrations", path: null, icon: Plug },
    ],
  },
  {
    title: "Settings",
    icon: SettingsIcon,
    items: [
      { label: "Account", path: "/portal/settings", icon: SettingsIcon },
      { label: "Store", path: null, icon: Store },
      { label: "Branding", path: null, icon: Palette },
      { label: "Domains", path: "/portal/domains", icon: Globe },
      { label: "Billing", path: null, icon: CreditCard },
      { label: "Security", path: null, icon: ShieldCheck },
    ],
  },
];

const DEFAULT_OPEN = new Set(["Growth", "Commerce", "Website", "Marketing", "Settings"]);

function NavLeafRow({ item, active }: { item: NavLeaf; active: boolean }) {
  const Icon = item.icon;

  if (!item.path) {
    return (
      <Link
        to={`/portal/coming-soon?feature=${encodeURIComponent(item.label)}`}
        className="flex items-center gap-2.5 rounded-md py-1.5 pl-7 pr-3 text-sm text-gray-400 hover:bg-gray-50 hover:text-gray-600"
      >
        <Icon size={14} />
        <span className="flex-1">{item.label}</span>
        <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
          Soon
        </span>
      </Link>
    );
  }

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-2.5 rounded-md py-1.5 pl-7 pr-3 text-sm font-medium transition ${
        active ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon size={14} />
      {item.label}
    </Link>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { session, logout } = useDashboardAuth();
  const [openSections, setOpenSections] = useState<Set<string>>(DEFAULT_OPEN);

  function toggleSection(title: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title);
      else next.add(title);
      return next;
    });
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white sm:flex">
        <div className="px-3 pb-3 pt-5">
          <Link to="/" className="mb-6 flex flex-col px-2">
            <span className="text-lg font-bold uppercase tracking-wide text-gray-900">Lurnics</span>
            <span className="h-0.5 w-6 bg-orange-500" />
          </Link>

          <Link
            to={TOP_LEVEL.path!}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition ${
              pathname === TOP_LEVEL.path
                ? "bg-orange-50 text-orange-600"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard size={16} />
            {TOP_LEVEL.label}
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-3">
          {SECTIONS.map((section) => {
            const SectionIcon = section.icon;
            const open = openSections.has(section.title);

            return (
              <div key={section.title} className="border-t border-gray-100 pt-1 first:border-t-0 first:pt-0">
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600"
                >
                  <SectionIcon size={14} />
                  <span className="flex-1">{section.title}</span>
                  <ChevronDown
                    size={13}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <div className="space-y-0.5 pb-1">
                    {section.items.map((item) => (
                      <NavLeafRow key={item.label} item={item} active={item.path === pathname} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="space-y-0.5 border-t border-gray-100 px-3 py-3">
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-3 sm:px-8">
          <div>
            <p className="text-sm font-semibold text-gray-900">{session?.business.name}</p>
            <p className="text-xs text-gray-400">lurnics.com/{session?.business.slug}</p>
          </div>
          <div className="flex items-center gap-2.5 rounded-full border border-gray-200 py-1 pl-1 pr-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
              {session?.user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs">
              <p className="font-medium text-gray-900">{session?.user.name}</p>
              <p className="capitalize text-gray-400">{session?.role}</p>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 sm:px-8">{children}</main>
      </div>
    </div>
  );
}
