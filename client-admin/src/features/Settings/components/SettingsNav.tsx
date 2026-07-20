import { useState } from "react";
import {
  Settings,
  Building2,
  Users,
  Shield,
  CreditCard,
  Plug,
  Mail,
  Banknote,
  Bell,
  Lock,
  SlidersHorizontal,
  History,
} from "lucide-react";

const categories = [
  { icon: Settings, label: "General", description: "General settings and preferences" },
  { icon: Building2, label: "Company Profile", description: "Manage your company information" },
  { icon: Users, label: "Team & Members", description: "Manage team members and roles" },
  { icon: Shield, label: "Roles & Permissions", description: "Set permissions for roles" },
  { icon: CreditCard, label: "Billing & Subscription", description: "Manage subscription and billing" },
  { icon: Plug, label: "Integrations", description: "Third-party services and APIs" },
  { icon: Mail, label: "Email Settings", description: "Configure email and templates" },
  { icon: Banknote, label: "Payment Gateways", description: "Configure payment providers" },
  { icon: Bell, label: "Notifications", description: "Manage system notifications" },
  { icon: Lock, label: "Security", description: "Security and access control" },
  { icon: SlidersHorizontal, label: "System Preferences", description: "Other system preferences" },
  { icon: History, label: "Audit Logs", description: "View system activity logs" },
];

export default function SettingsNav() {
  const [active, setActive] = useState("General");

  return (
    <div className="w-full space-y-1 rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:w-72 lg:shrink-0">
      {categories.map(({ icon: Icon, label, description }) => {
        const isActive = label === active;
        return (
          <button
            key={label}
            type="button"
            onClick={() => setActive(label)}
            className={`flex w-full items-start gap-3 rounded-md px-3 py-2.5 text-left text-sm ${
              isActive ? "bg-orange-50 text-gray-900" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <Icon size={16} className="mt-0.5 shrink-0" />
            <span>
              <span className="block">{label}</span>
              <span className="block text-xs text-gray-500">{description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
