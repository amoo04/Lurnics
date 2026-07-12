import { useState } from "react";
import { Cloud } from "lucide-react";
import Toggle from "../../../components/ui/Toggle";

export default function StorageSettingsPanel() {
  const [autoCleanup, setAutoCleanup] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-2">
        <Cloud size={18} className="text-indigo-300" />
        <h3 className="font-semibold">Storage Settings</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Default Storage Disk</label>
          <p className="mb-1.5 text-xs text-gray-500">Select default disk for file uploads</p>
          <select className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option>DigitalOcean Spaces</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Max File Upload Size</label>
          <p className="mb-1.5 text-xs text-gray-500">Maximum file size for uploads</p>
          <select className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option>10 MB</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Allowed File Types</label>
          <p className="mb-1.5 text-xs text-gray-500">Allowed file types for uploads</p>
          <input
            type="text"
            defaultValue="jpg, jpeg, png, pdf, doc, docx, xlsx, zip"
            className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-200">Automatic File Cleanup</p>
            <p className="text-xs text-gray-500">Automatically delete old files</p>
          </div>
          <Toggle checked={autoCleanup} onChange={setAutoCleanup} />
        </div>
      </div>
    </div>
  );
}
