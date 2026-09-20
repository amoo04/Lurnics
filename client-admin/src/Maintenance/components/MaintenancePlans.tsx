import { Check } from "lucide-react";
import { MAINTENANCE_PLANS } from "../api/maintenance.types";
import { formatCurrency } from "../../lib/uiHelpers";

export default function MaintenancePlans({ onSelectPlan }: { onSelectPlan: (planName: string) => void }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Maintenance Plans</h3>

      <div className="space-y-4">
        {MAINTENANCE_PLANS.map(({ name, price, annualPrice, features, highlight }) => (
          <div
            key={name}
            className={`rounded-lg border p-4 ${
              highlight ? "border-orange-200 bg-orange-50" : "border-gray-200"
            }`}
          >
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(price)} <span className="text-xs font-normal text-gray-500">/ 3 months</span>
            </p>
            <p className="text-xs text-gray-500">{formatCurrency(annualPrice)} / year</p>
            <ul className="mt-2 space-y-1.5 text-xs text-gray-600">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-1.5">
                  <Check size={12} className="text-green-600" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onSelectPlan(name)}
              className={`mt-3 w-full rounded-md py-2 text-xs font-medium ${
                highlight ? "bg-gray-900 text-white hover:bg-black" : "border border-gray-300 text-gray-900 hover:bg-gray-50"
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
