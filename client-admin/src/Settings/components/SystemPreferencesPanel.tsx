import { SlidersHorizontal } from "lucide-react";
import Toggle from "../../components/ui/Toggle";
import type { Settings } from "../api/settings.types";

interface SystemPreferencesPanelProps {
  values: Pick<Settings, "defaultPaginationSize" | "defaultTheme" | "language" | "maintenanceMode">;
  onChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export default function SystemPreferencesPanel({ values, onChange }: SystemPreferencesPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-orange-500" />
        <h3 className="font-semibold text-gray-900">System Preferences</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm text-gray-600">Default Pagination Size</label>
          <input
            type="text"
            value={values.defaultPaginationSize}
            onChange={(e) => onChange("defaultPaginationSize", Number(e.target.value) || 0)}
            className="w-24 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-right text-sm text-gray-900 outline-none focus:border-gray-900"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-sm text-gray-600">Default Theme</label>
          <select
            value={values.defaultTheme}
            onChange={(e) => onChange("defaultTheme", e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="dark">Dark</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-sm text-gray-600">Language</label>
          <select
            value={values.language}
            onChange={(e) => onChange("language", e.target.value)}
            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="en">English</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-900">Maintenance Mode</p>
            <p className="text-xs text-gray-500">Enable to put the system in maintenance mode</p>
          </div>
          <Toggle checked={values.maintenanceMode} onChange={(value) => onChange("maintenanceMode", value)} />
        </div>
      </div>
    </div>
  );
}
