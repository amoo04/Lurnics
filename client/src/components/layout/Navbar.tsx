import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  Compass,
  Calculator,
  DollarSign,
  ClipboardList,
  LayoutTemplate,
  Globe2,
  Code2,
  Cog,
  Building2,
  Briefcase,
  Newspaper,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";

const links = [
  { label: "Home", path: "/" },
  { label: "Solutions", path: "/solutions" },
  { label: "Services", path: "/services" },
  { label: "Industries", path: "/industries" },
  { label: "Cost Calculator", path: "/leak-calculator" },
  { label: "Growth Blueprint", path: "/growth-blueprint" },
  { label: "Software Cost Estimator", path: "/software-cost-estimator" },
  { label: "Requirements Generator", path: "/requirements-generator" },
  { label: "Success Stories", path: "/case-studies" },
  { label: "About", path: "/about" },
  { label: "Insights", path: "/insights" },
  { label: "Pricing", path: "/pricing" },
  { label: "Contact", path: "/contact" },
];

interface MenuItem {
  label: string;
  description?: string;
  to: string | null;
  icon: LucideIcon;
}

const FREE_TOOLS: MenuItem[] = [
  {
    label: "Manual Work Cost Calculator",
    description: "See what manual work is costing you monthly",
    to: "/leak-calculator",
    icon: Calculator,
  },
  {
    label: "Growth Blueprint",
    description: "Get a personalized growth plan",
    to: "/growth-blueprint",
    icon: Compass,
  },
  {
    label: "Software Cost Estimator",
    description: "Tell us your project, get a real estimate",
    to: "/software-cost-estimator",
    icon: DollarSign,
  },
  {
    label: "Requirements Generator",
    description: "Turn your idea into a shareable brief",
    to: "/requirements-generator",
    icon: ClipboardList,
  },
];

const IMPLEMENTATION: MenuItem[] = [
  { label: "Landing Pages", to: "/landing-pages", icon: LayoutTemplate },
  { label: "Marketing Websites", to: "/marketing-websites", icon: Globe2 },
  { label: "Business Software", to: "/business-software", icon: Code2 },
  { label: "Automation", to: "/automation", icon: Cog },
  { label: "Enterprise Systems", to: "/enterprise-systems", icon: Building2 },
];

const RESOURCES: MenuItem[] = [
  { label: "Case Studies", to: "/case-studies", icon: Briefcase },
  { label: "Insights", to: "/insights", icon: Newspaper },
  { label: "Templates", to: null, icon: LayoutGrid },
];

function MenuLink({ item }: { item: MenuItem }) {
  const Icon = item.icon;

  if (!item.to) {
    return (
      <li className="flex cursor-default items-start gap-2.5 rounded-lg px-2.5 py-2 opacity-50">
        <Icon size={15} className="mt-0.5 shrink-0 text-gray-400" />
        <span className="flex-1">
          <span className="block text-sm text-gray-400">{item.label}</span>
          {item.description && <span className="mt-0.5 block text-xs text-gray-300">{item.description}</span>}
        </span>
        <span className="mt-0.5 shrink-0 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
          Soon
        </span>
      </li>
    );
  }

  return (
    <li>
      <Link
        to={item.to}
        className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 hover:bg-orange-50"
      >
        <Icon size={15} className="mt-0.5 shrink-0 text-orange-500" />
        <span>
          <span className="block text-sm text-gray-900">{item.label}</span>
          {item.description && <span className="mt-0.5 block text-xs text-gray-500">{item.description}</span>}
        </span>
      </Link>
    </li>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative flex items-center justify-between px-4 py-5 sm:px-8 lg:px-20">
      <Link to="/" onClick={() => setOpen(false)} className="flex flex-col">
        <span className="text-lg font-bold uppercase tracking-wide text-gray-900">Lurnics</span>
        <span className="h-0.5 w-6 bg-orange-500" />
      </Link>

      <ul className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
        <li>
          <Link
            to="/"
            className={
              pathname === "/" ? "border-b-2 border-orange-500 pb-1 text-gray-900" : "transition hover:text-gray-900"
            }
          >
            Home
          </Link>
        </li>

        <li className="group relative">
          <Link
            to="/solutions"
            className={`flex items-center gap-1 ${
              pathname.startsWith("/solutions") ? "border-b-2 border-orange-500 pb-1 text-gray-900" : "transition hover:text-gray-900"
            }`}
          >
            Solutions
            <ChevronDown size={14} className="transition group-hover:rotate-180" />
          </Link>

          <div className="invisible absolute left-1/2 top-full z-50 w-[680px] max-w-[90vw] -translate-x-1/2 pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
            <div className="grid grid-cols-3 gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
              <div>
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
                  Free Business Tools
                </p>
                <ul className="space-y-1">
                  {FREE_TOOLS.map((item) => (
                    <MenuLink key={item.label} item={item} />
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Implementation
                </p>
                <ul className="space-y-1">
                  {IMPLEMENTATION.map((item) => (
                    <MenuLink key={item.label} item={item} />
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Resources
                </p>
                <ul className="space-y-1">
                  {RESOURCES.map((item) => (
                    <MenuLink key={item.label} item={item} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </li>

        <li>
          <Link
            to="/services"
            className={
              pathname === "/services" ? "border-b-2 border-orange-500 pb-1 text-gray-900" : "transition hover:text-gray-900"
            }
          >
            Services
          </Link>
        </li>
        <li>
          <Link
            to="/industries"
            className={
              pathname === "/industries" ? "border-b-2 border-orange-500 pb-1 text-gray-900" : "transition hover:text-gray-900"
            }
          >
            Industries
          </Link>
        </li>

        {links.slice(8).map(({ label, path }) => (
          // Cost Calculator, Growth Blueprint, Software Cost Estimator, and
          // Requirements Generator (indices 4-7) are intentionally skipped
          // here — shown inside the Solutions dropdown instead of as their
          // own tabs.
          <li key={label}>
            <Link
              to={path}
              className={
                path === pathname
                  ? "border-b-2 border-orange-500 pb-1 text-gray-900"
                  : "transition hover:text-gray-900"
              }
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="hidden items-center gap-4 md:flex">
        <Link to="/signin" className="text-sm text-gray-600 transition hover:text-gray-900">
          Sign In
        </Link>
        <Link
          to="/signup"
          className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black"
        >
          Create Your Store
        </Link>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-gray-600 hover:text-gray-900 md:hidden"
        aria-label="Toggle menu"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full z-50 border-t border-gray-200 bg-white px-4 py-4 md:hidden">
          <ul className="space-y-1 text-sm text-gray-600">
            {links.map(({ label, path }) => (
              <li key={label}>
                <Link
                  to={path}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2.5 ${
                    path === pathname ? "bg-orange-50 text-gray-900" : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/signin"
            onClick={() => setOpen(false)}
            className="mt-3 block w-full rounded-md border border-gray-300 px-5 py-2.5 text-center text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            className="mt-2 block w-full rounded-md bg-gray-900 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-black"
          >
            Create Your Store
          </Link>
        </div>
      )}
    </nav>
  );
}
