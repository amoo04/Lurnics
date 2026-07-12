import { useState } from "react";
import { Settings } from "lucide-react";
import Toggle from "../../../components/ui/Toggle";

const initialToggles = [
  { key: "registrations", label: "Allow New Registrations", description: "Allow new users/clients to register", checked: true },
  { key: "emailVerification", label: "Email Verification", description: "Require email verification for new users", checked: true },
  { key: "twoFactor", label: "Two-Factor Authentication", description: "Require 2FA for all admin users", checked: true },
];

export default function ApplicationSettingsPanel() {
  const [toggles, setToggles] = useState(initialToggles);

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-2">
        <Settings size={18} className="text-indigo-300" />
        <h3 className="font-semibold">Application Settings</h3>
      </div>

      <div className="space-y-4">
        {toggles.map(({ key, label, description, checked }) => (
          <div key={key} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-200">{label}</p>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
            <Toggle
              checked={checked}
              onChange={(value) =>
                setToggles((prev) => prev.map((t) => (t.key === key ? { ...t, checked: value } : t)))
              }
            />
          </div>
        ))}

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Session Timeout</label>
          <p className="mb-1.5 text-xs text-gray-500">Automatically log out inactive users</p>
          <select className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option>30 minutes</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Currency</label>
          <p className="mb-1.5 text-xs text-gray-500">Default currency for billing and invoices</p>
          <select className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option>NGN (₦) - Naira</option>
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-300">Items Per Page</label>
          <p className="mb-1.5 text-xs text-gray-500">Number of items to show per page</p>
          <select className="w-full rounded-md border border-white/10 bg-white/[0.02] px-4 py-2.5 text-sm text-gray-300 outline-none">
            <option>10</option>
          </select>
        </div>
      </div>
    </div>
  );
}
