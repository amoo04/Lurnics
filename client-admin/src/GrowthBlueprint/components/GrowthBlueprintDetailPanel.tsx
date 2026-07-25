import { Mail, Phone, Globe, Building2 } from "lucide-react";
import type { GrowthBlueprintSubmission } from "../api/growth-blueprint.types";

interface GrowthBlueprintDetailPanelProps {
  submission: GrowthBlueprintSubmission;
}

function Tags({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-gray-400">None selected</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span key={item} className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600">
          {item}
        </span>
      ))}
    </div>
  );
}

const TOOLS: { key: keyof GrowthBlueprintSubmission; label: string }[] = [
  { key: "hasWebsite", label: "Website" },
  { key: "hasLandingPages", label: "Landing Pages" },
  { key: "hasCrm", label: "CRM" },
  { key: "hasEmailAutomation", label: "Email Automation" },
  { key: "hasAnalytics", label: "Analytics" },
];

export default function GrowthBlueprintDetailPanel({ submission }: GrowthBlueprintDetailPanelProps) {
  return (
    <div className="w-full space-y-4 lg:w-96 lg:shrink-0">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="font-semibold text-gray-900">{submission.companyName}</p>
        <p className="text-sm text-gray-500">{submission.contactName}</p>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p className="flex items-center gap-2">
            <Mail size={14} className="text-orange-500" />
            {submission.email}
          </p>
          {submission.phone && (
            <p className="flex items-center gap-2">
              <Phone size={14} className="text-orange-500" />
              {submission.phone}
            </p>
          )}
          {submission.website && (
            <p className="flex items-center gap-2">
              <Globe size={14} className="text-orange-500" />
              {submission.website}
            </p>
          )}
          <p className="flex items-center gap-2">
            <Building2 size={14} className="text-orange-500" />
            {submission.industry} · {submission.businessModel} · {submission.country}
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-gray-500">Employees</p>
            <p className="font-medium text-gray-900">{submission.employees}</p>
          </div>
          {submission.revenueRange && (
            <div>
              <p className="text-gray-500">Revenue</p>
              <p className="font-medium text-gray-900">{submission.revenueRange}</p>
            </div>
          )}
          {submission.yearsInBusiness && (
            <div>
              <p className="text-gray-500">Years in Business</p>
              <p className="font-medium text-gray-900">{submission.yearsInBusiness}</p>
            </div>
          )}
          {submission.monthlyBudget && (
            <div>
              <p className="text-gray-500">Monthly Budget</p>
              <p className="font-medium text-gray-900">{submission.monthlyBudget}</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-gray-900">Goals</p>
        <Tags items={submission.goals} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-gray-900">Current Channels</p>
        <Tags items={submission.currentChannels} />
        <p className="mb-2 mt-4 text-sm font-semibold text-gray-900">Already in Place</p>
        <div className="flex flex-wrap gap-1.5">
          {TOOLS.filter((t) => submission[t.key]).map((t) => (
            <span key={t.key} className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-600">
              {t.label}
            </span>
          ))}
          {TOOLS.every((t) => !submission[t.key]) && <p className="text-sm text-gray-400">None yet</p>}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-gray-900">Challenges</p>
        <Tags items={submission.challenges} />
      </div>

      {submission.leadId && (
        <p className="text-center text-xs text-gray-500">
          Linked to a lead in your CRM — see Leads for outreach tools.
        </p>
      )}
    </div>
  );
}
