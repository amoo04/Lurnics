import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, Eye, Sparkles, Moon, Minus } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { fetchSections } from "../hooks/useStoreSections";
import { fetchPageStats } from "../hooks/usePages";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import type { StoreSection } from "../api/store-sections.types";

const THEME_OPTIONS = [
  {
    id: "classic",
    name: "Lurnics Classic",
    description: "Light, clean, orange accents",
    icon: Sparkles,
    preview: "bg-white border border-gray-200",
    swatch: "bg-orange-500",
  },
  {
    id: "modern",
    name: "Lurnics Modern",
    description: "Dark, bold, indigo accents",
    icon: Moon,
    preview: "bg-gray-950 border border-gray-800",
    swatch: "bg-indigo-500",
  },
  {
    id: "minimal",
    name: "Lurnics Minimal",
    description: "Black & white, no color",
    icon: Minus,
    preview: "bg-white border border-black",
    swatch: "bg-black",
  },
] as const;

function timeAgo(dateString: string) {
  const date = new Date(dateString.replace(" ", "T") + "Z");
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function Themes() {
  const { session, updateBusinessSettings } = useDashboardAuth();
  const [sections, setSections] = useState<StoreSection[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([fetchSections(), fetchPageStats()])
      .then(([sectionsResult, pageStats]) => {
        setSections(sectionsResult);
        setTotalPages(pageStats.totalPages);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleCount = sections.filter((s) => s.visible).length;
  const lastUpdated = sections.reduce<string | null>((latest, s) => {
    if (!latest || new Date(s.updatedAt) > new Date(latest)) return s.updatedAt;
    return latest;
  }, null);

  const currentTheme = session?.business.theme ?? "classic";
  const currentThemeName = THEME_OPTIONS.find((t) => t.id === currentTheme)?.name ?? "Lurnics Classic";

  async function activate(themeId: string) {
    setSwitchingTo(themeId);
    try {
      await updateBusinessSettings({ theme: themeId });
    } finally {
      setSwitchingTo(null);
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Themes</h1>
          <p className="text-sm text-gray-500">Choose how your storefront looks.</p>
        </div>
        {session && (
          <a
            href={`/store/${session.business.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Eye size={15} />
            Preview Store
          </a>
        )}
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Current Theme</p>
          <p className="mt-2 text-lg font-bold text-gray-900">{currentThemeName}</p>
          <p className="mt-1 text-xs text-emerald-600">Live</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Last Updated</p>
          <p className="mt-2 text-lg font-bold text-gray-900">{loading ? "…" : lastUpdated ? timeAgo(lastUpdated) : "—"}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Pages</p>
          <p className="mt-2 text-lg font-bold text-gray-900">{loading ? "…" : totalPages}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium text-gray-500">Sections Visible</p>
          <p className="mt-2 text-lg font-bold text-gray-900">{loading ? "…" : `${visibleCount} / ${sections.length}`}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        {THEME_OPTIONS.map((theme) => {
          const Icon = theme.icon;
          const isCurrent = currentTheme === theme.id;

          return (
            <div key={theme.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className={`mb-3 flex h-32 items-center justify-center rounded-lg ${theme.preview}`}>
                <Icon size={28} className={theme.id === "modern" ? "text-white" : "text-gray-400"} />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-900">{theme.name}</p>
                <span className={`h-3 w-3 rounded-full ${theme.swatch}`} />
              </div>
              <p className="mt-1 text-xs text-gray-400">{theme.description}</p>

              {isCurrent ? (
                <div className="mt-3 flex items-center justify-center gap-1.5 rounded-md bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-600">
                  <CheckCircle2 size={14} />
                  Current Theme
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => activate(theme.id)}
                  disabled={switchingTo === theme.id}
                  className="mt-3 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
                >
                  {switchingTo === theme.id ? "Activating…" : "Activate"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-5 text-center text-sm text-gray-500">
        Want to change colors, text, or layout content within a theme?{" "}
        <Link to="/portal/store-builder" className="font-medium text-orange-600 hover:text-orange-700">
          Go to Store Builder →
        </Link>
      </div>
    </DashboardLayout>
  );
}
