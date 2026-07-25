import { Cloud } from "lucide-react";
import Toggle from "../../components/ui/Toggle";
import type { Settings } from "../api/settings.types";

interface StorageSettingsPanelProps {
  values: Pick<Settings, "storageDisk" | "maxUploadSizeMb" | "allowedFileTypes" | "autoFileCleanup">;
  onChange: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
}

export default function StorageSettingsPanel({ values, onChange }: StorageSettingsPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Cloud size={18} className="text-orange-500" />
        <h3 className="font-semibold text-gray-900">Storage Settings</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Default Storage Disk</label>
          <p className="mb-1.5 text-xs text-gray-500">Select default disk for file uploads</p>
          <select
            value={values.storageDisk}
            onChange={(e) => onChange("storageDisk", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="digitalocean-spaces">DigitalOcean Spaces</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Max File Upload Size</label>
          <p className="mb-1.5 text-xs text-gray-500">Maximum file size for uploads</p>
          <select
            value={values.maxUploadSizeMb}
            onChange={(e) => onChange("maxUploadSizeMb", Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            <option value={10}>10 MB</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Allowed File Types</label>
          <p className="mb-1.5 text-xs text-gray-500">Allowed file types for uploads</p>
          <input
            type="text"
            value={values.allowedFileTypes}
            onChange={(e) => onChange("allowedFileTypes", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-900">Automatic File Cleanup</p>
            <p className="text-xs text-gray-500">Automatically delete old files</p>
          </div>
          <Toggle checked={values.autoFileCleanup} onChange={(value) => onChange("autoFileCleanup", value)} />
        </div>
      </div>
    </div>
  );
}
