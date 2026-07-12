import { Check } from "lucide-react";
import { MAINTENANCE_PLANS } from "../api/maintenance.types";
import { formatCurrency } from "../../../lib/uiHelpers";

export default function MaintenancePlans({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="mb-4 font-semibold">Maintenance Plans</h3>

      <div className="space-y-4">
        {MAINTENANCE_PLANS.map(({ name, price, features, highlight }) => (
          <div
            key={name}
            className={`rounded-lg border p-4 ${
              highlight ? "border-indigo-400/50 bg-indigo-500/10" : "border-white/10"
            }`}
          >
            <p className="font-semibold">{name}</p>
            <p className="text-lg font-bold">
              {formatCurrency(price)} <span className="text-xs font-normal text-gray-500">/ year</span>
            </p>
            <ul className="mt-2 space-y-1.5 text-xs text-gray-400">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <Check size={12} className="text-green-400" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onSelectPlan(name)}
              className={`mt-3 w-full rounded-md py-2 text-xs font-medium ${
                highlight ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white" : "border border-white/10 text-gray-300"
              }`}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
