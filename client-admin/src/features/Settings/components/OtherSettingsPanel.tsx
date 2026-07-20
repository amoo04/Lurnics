import { Layers } from "lucide-react";
import type { Settings } from "../api/settings.types";

function TextAreaField({
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
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
      />
    </div>
  );
}

interface OtherSettingsPanelProps {
  values: Pick<Settings, "companyAddress" | "invoiceTerms" | "footerText">;
  onChange: <K extends keyof OtherSettingsPanelProps["values"]>(key: K, value: OtherSettingsPanelProps["values"][K]) => void;
}

export default function OtherSettingsPanel({ values, onChange }: OtherSettingsPanelProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Layers size={18} className="text-orange-500" />
        <h3 className="font-semibold text-gray-900">Other Settings</h3>
      </div>

      <div className="space-y-4">
        <TextAreaField
          label="Company Address"
          value={values.companyAddress}
          onChange={(v) => onChange("companyAddress", v)}
        />
        <TextAreaField
          label="Default Invoice Terms"
          value={values.invoiceTerms}
          onChange={(v) => onChange("invoiceTerms", v)}
        />
        <TextAreaField label="Footer Text" value={values.footerText} onChange={(v) => onChange("footerText", v)} />
      </div>
    </div>
  );
}
