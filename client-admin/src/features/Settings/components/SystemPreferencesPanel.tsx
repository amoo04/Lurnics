import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import Toggle from "../../../components/ui/Toggle";

export default function SystemPreferencesPanel() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-indigo-300" />
        <h3 className="font-semibold">System Preferences</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <label className="text-sm text-gray-300">Default Pagination Size</label>
          <input
            type="text"
            defaultValue="10"
            className="w-24 rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-right text-sm text-gray-300 outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-sm text-gray-300">Default Theme</label>
          <select className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-gray-300 outline-none">
            <option>Dark</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <label className="text-sm text-gray-300">Language</label>
          <select className="rounded-md border border-white/10 bg-white/[0.02] px-3 py-1.5 text-sm text-gray-300 outline-none">
            <option>English</option>
          </select>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-200">Maintenance Mode</p>
            <p className="text-xs text-gray-500">Enable to put the system in maintenance mode</p>
          </div>
          <Toggle checked={maintenanceMode} onChange={setMaintenanceMode} />
        </div>
      </div>
    </div>
  );
}
