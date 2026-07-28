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
  values: Pick<Settings, "siteName" | "tagline" | "contactEmail" | "contactPhone" | "website" | "companyAddress">;
  onChange: <K extends keyof SiteInformationFormProps["values"]>(key: K, value: SiteInformationFormProps["values"][K]) => void;
}

export default function SiteInformationForm({ values, onChange }: SiteInformationFormProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Building2 size={18} className="text-orange-500" />
        <h3 className="font-semibold text-gray-900">Company Information</h3>
      </div>

      <div className="space-y-4">
        <Field label="Company Name" value={values.siteName} onChange={(v) => onChange("siteName", v)} />
        <Field label="Tagline" value={values.tagline} onChange={(v) => onChange("tagline", v)} />
        <Field label="Email" value={values.contactEmail} onChange={(v) => onChange("contactEmail", v)} />
        <Field label="Phone" value={values.contactPhone} onChange={(v) => onChange("contactPhone", v)} />
        <Field label="Website" value={values.website} onChange={(v) => onChange("website", v)} />

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Address</label>
          <textarea
            value={values.companyAddress}
            onChange={(e) => onChange("companyAddress", e.target.value)}
            rows={2}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          />
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
