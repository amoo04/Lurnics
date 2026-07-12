import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sun, Bell, ChevronDown, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useSidebar } from "../../context/SidebarContext";

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
    <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button type="button" onClick={toggle} className="text-gray-400 hover:text-white lg:hidden">
          <Menu size={22} />
        </button>

        <div className="hidden items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-gray-400 sm:flex sm:w-48 md:w-80">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full bg-transparent outline-none placeholder:text-gray-500"
          />
          <span className="hidden rounded border border-white/10 px-1.5 py-0.5 text-xs text-gray-500 md:inline">
            ⌘K
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button type="button" className="text-gray-400 hover:text-white sm:hidden">
          <Search size={18} />
        </button>

        <button type="button" className="text-gray-400 hover:text-white">
          <Sun size={18} />
        </button>

        <button type="button" className="relative text-gray-400 hover:text-white">
          <Bell size={20} />
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-medium text-white">
            12
          </span>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium leading-tight">{user?.name}</p>
              <p className="text-xs leading-tight text-gray-500">{formatRole(user?.roles[0])}</p>
            </div>
            <ChevronDown size={14} className="hidden text-gray-500 sm:block" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 rounded-md border border-white/10 bg-[#0f1024] py-1 shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5"
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
