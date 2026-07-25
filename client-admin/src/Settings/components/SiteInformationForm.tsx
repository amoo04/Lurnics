import { Building2, Upload } from "lucide-react";
import logo from "../../assets/logo/logo3.png";
import type { Settings } from "../api/settings.types";

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-gray-600">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
      />
    </div>
  );
}

interface SiteInformationFormProps {
  values: Pick<Settings, "siteName" | "tagline" | "contactEmail" | "contactPhone" | "website" | "timeZone" | "dateFormat" | "timeFormat">;
  onChange: <K extends keyof SiteInformationFormProps["values"]>(key: K, value: SiteInformationFormProps["values"][K]) => void;
}

export default function SiteInformationForm({ values, onChange }: SiteInformationFormProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Building2 size={18} className="text-orange-500" />
        <h3 className="font-semibold text-gray-900">Site Information</h3>
      </div>

      <div className="space-y-4">
        <Field label="Company Name" value={values.siteName} onChange={(v) => onChange("siteName", v)} />
        <Field label="Tagline" value={values.tagline} onChange={(v) => onChange("tagline", v)} />
        <Field label="Email" value={values.contactEmail} onChange={(v) => onChange("contactEmail", v)} />
        <Field label="Phone" value={values.contactPhone} onChange={(v) => onChange("contactPhone", v)} />
        <Field label="Website" value={values.website} onChange={(v) => onChange("website", v)} />

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Time Zone</label>
          <select
            value={values.timeZone}
            onChange={(e) => onChange("timeZone", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="Africa/Lagos">(GMT+01:00) West Africa Time (WAT)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">Date Format</label>
            <select
              value={values.dateFormat}
              onChange={(e) => onChange("dateFormat", e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
            >
              <option value="MMM DD, YYYY">May 20, 2025 (MMM DD, YYYY)</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">Time Format</label>
            <select
              value={values.timeFormat}
              onChange={(e) => onChange("timeFormat", e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
            >
              <option value="12h">10:30 PM (12-hour)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Logo</label>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
              <img src={logo} alt="Lurnics" className="h-full w-full object-contain" />
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 hover:bg-gray-50"
            >
              <Upload size={14} />
              Change Logo
            </button>
            <p className="text-xs text-gray-500">Recommended: 512x512px, PNG or SVG</p>
          </div>
        </div>
      </div>
    </div>
  );
}
