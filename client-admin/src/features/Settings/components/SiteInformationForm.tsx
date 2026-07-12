import { Building2, Upload } from "lucide-react";
import logo from "../../../assets/logo/logo3.png";

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-gray-300">{label}</label>
      <input
        type="text"
        defaultValue={defaultValue}
        className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none"
      />
    </div>
  );
}

export default function SiteInformationForm() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-2">
        <Building2 size={18} className="text-indigo-300" />
        <h3 className="font-semibold">Site Information</h3>
      </div>

      <div className="space-y-4">
        <Field label="Company Name" defaultValue="Lurnics Technologies" />
        <Field label="Tagline" defaultValue="Building the future, one solution at a time." />
        <Field label="Email" defaultValue="hello@lurnics.com" />
        <Field label="Phone" defaultValue="+234 810 123 4567" />
        <Field label="Website" defaultValue="https://lurnics.com" />

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Time Zone</label>
          <select className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option>(GMT+01:00) West Africa Time (WAT)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm text-gray-300">Date Format</label>
            <select className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none">
              <option>May 20, 2025 (MMM DD, YYYY)</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-300">Time Format</label>
            <select className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none">
              <option>10:30 PM (12-hour)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Logo</label>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
              <img src={logo} alt="Lurnics" className="h-full w-full object-contain" />
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-white/10 px-4 py-2 text-sm text-gray-300"
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
