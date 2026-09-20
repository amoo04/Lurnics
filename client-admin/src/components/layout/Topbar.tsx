import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sun, ChevronDown, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";
import NotificationsBell from "../../Notifications/components/NotificationsBell";

function formatRole(role?: string): string {
  if (!role) return "";
  return role
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const { toggle } = useSidebar();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button type="button" onClick={toggle} className="text-gray-500 hover:text-gray-900 lg:hidden">
          <Menu size={22} />
        </button>

        <div className="hidden items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-2 text-sm text-gray-500 sm:flex sm:w-48 md:w-80">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-400"
          />
          <span className="hidden rounded border border-gray-200 px-1.5 py-0.5 text-xs text-gray-500 md:inline">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button type="button" className="text-gray-500 hover:text-gray-900 sm:hidden">
          <Search size={18} />
        </button>

        <button type="button" className="text-gray-500 hover:text-gray-900">
          <Sun size={18} />
        </button>

        <NotificationsBell />

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight text-gray-900">{user?.name}</p>
              <p className="text-xs leading-tight text-gray-500">{formatRole(user?.roles[0])}</p>
            </div>
            <ChevronDown size={14} className="hidden text-gray-500 sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
