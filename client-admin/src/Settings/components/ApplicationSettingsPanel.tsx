import { Settings } from "lucide-react";
import Toggle from "../../components/ui/Toggle";
import type { Settings as SettingsType } from "../api/settings.types";

interface ApplicationSettingsPanelProps {
  values: Pick<
    SettingsType,
    "allowRegistrations" | "requireEmailVerification" | "requireTwoFactor" | "sessionTimeoutMinutes" | "currency" | "itemsPerPage"
  >;
  onChange: <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => void;
}

export default function ApplicationSettingsPanel({ values, onChange }: ApplicationSettingsPanelProps) {
  const toggles = [
    {
      key: "allowRegistrations" as const,
      label: "Allow New Registrations",
      description: "Allow new users/clients to register",
      checked: values.allowRegistrations,
    },
    {
      key: "requireEmailVerification" as const,
      label: "Email Verification",
      description: "Require email verification for new users",
      checked: values.requireEmailVerification,
    },
    {
      key: "requireTwoFactor" as const,
      label: "Two-Factor Authentication",
      description: "Require 2FA for all admin users",
      checked: values.requireTwoFactor,
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <Settings size={18} className="text-orange-500" />
        <h3 className="font-semibold text-gray-900">Application Settings</h3>
      </div>

      <div className="space-y-4">
        {toggles.map(({ key, label, description, checked }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-900">{label}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <Toggle checked={checked} onChange={(value) => onChange(key, value)} />
          </div>
        ))}

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Session Timeout</label>
          <p className="mb-1.5 text-xs text-gray-500">Automatically log out inactive users</p>
          <select
            value={values.sessionTimeoutMinutes}
            onChange={(e) => onChange("sessionTimeoutMinutes", Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            <option value={30}>30 minutes</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Currency</label>
          <p className="mb-1.5 text-xs text-gray-500">Default currency for billing and invoices</p>
          <select
            value={values.currency}
            onChange={(e) => onChange("currency", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            <option value="NGN">NGN (₦) - Naira</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Items Per Page</label>
          <p className="mb-1.5 text-xs text-gray-500">Number of items to show per page</p>
          <select
            value={values.itemsPerPage}
            onChange={(e) => onChange("itemsPerPage", Number(e.target.value))}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          >
            <option value={10}>10</option>
          </select>
        </div>
      </div>
    </div>
  );
}
