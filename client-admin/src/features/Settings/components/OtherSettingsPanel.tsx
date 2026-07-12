import { Layers } from "lucide-react";

function TextAreaField({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-gray-300">{label}</label>
      <textarea
        defaultValue={defaultValue}
        rows={2}
        className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none"
      />
    </div>
  );
}

export default function OtherSettingsPanel() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-2">
        <Layers size={18} className="text-indigo-300" />
        <h3 className="font-semibold">Other Settings</h3>
      </div>

      <div className="space-y-4">
        <TextAreaField label="Company Address" defaultValue="Oluyole Estate, Ibadan, Oyo State, Nigeria" />
        <TextAreaField label="Default Invoice Terms" defaultValue="Payment is due within 7 days of invoice date." />
        <TextAreaField label="Footer Text" defaultValue="© 2025 Lurnics Technologies. All rights reserved." />
      </div>
    </div>
  );
}
