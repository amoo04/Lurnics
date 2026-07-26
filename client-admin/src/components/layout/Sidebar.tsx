import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  Users,
  Target,
  Receipt,
  CreditCard,
  Wrench,
  FileText,
  BarChart2,
  Newspaper,
  Settings,
  LifeBuoy,
  Briefcase,
  Compass,
  X,
} from "lucide-react";
import { useSidebar } from "../../context/SidebarContext";

const links = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Analytics", path: "/analytics", icon: BarChart3 },
  { label: "Projects", path: "/projects", icon: FolderKanban },
  { label: "Clients", path: "/clients", icon: Users },
  { label: "Leads", path: "/leads", icon: Target },
  { label: "Invoices", path: "/invoices", icon: Receipt },
  { label: "Payments", path: "/payments", icon: CreditCard },
  { label: "Maintenance", path: "/maintenance", icon: Wrench },
  { label: "Documents", path: "/documents", icon: FileText },
  { label: "Insights", path: "/insights", icon: Newspaper },
  { label: "Success Stories", path: "/success-stories", icon: Briefcase },
  { label: "Growth Blueprint", path: "/growth-blueprint", icon: Compass },
  { label: "Reports", path: "/reports", icon: BarChart2 },
  { label: "Settings", path: "/settings", icon: Settings },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { mobileOpen, close } = useSidebar();

  return (
    <>
      {mobileOpen && (
        <div
          onClick={close}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link to="/" onClick={close} className="flex flex-col">
            <span className="text-lg font-bold uppercase tracking-wide text-gray-900">Lurnics</span>
            <span className="h-0.5 w-6 bg-orange-500" />
          </Link>
          <button type="button" onClick={close} className="text-gray-500 hover:text-gray-900 lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 flex-1 space-y-1 overflow-y-auto">
          {links.map(({ label, path, icon: Icon }) => {
            const active = path === pathname;
            return (
              <Link
                key={label}
                to={path}
                onClick={close}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm ${
                  active
                    ? "bg-orange-50 text-gray-900"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-50 text-orange-500">
            <LifeBuoy size={16} />
          </div>
          <p className="text-sm font-medium text-gray-900">Need Help?</p>
          <p className="mt-1 text-xs text-gray-500">
            Our support team is available 24/7 to assist you.
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-md bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-black"
          >
            Contact Support
          </button>
        </div>
      </aside>
    </>
  );
}
