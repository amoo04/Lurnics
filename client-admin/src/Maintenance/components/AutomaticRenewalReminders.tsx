import { Mail, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: Mail, iconBg: "bg-orange-50 text-orange-500", label: "90 Days Before", description: "Email reminder sent to client" },
  { icon: Mail, iconBg: "bg-orange-50 text-orange-500", label: "30 Days Before", description: "Second reminder sent to client" },
  { icon: Mail, iconBg: "bg-yellow-50 text-yellow-600", label: "7 Days Before", description: "Third reminder sent to client" },
  { icon: Mail, iconBg: "bg-red-50 text-red-500", label: "1 Day Before", description: "Final reminder sent to client" },
  { icon: CheckCircle2, iconBg: "bg-green-50 text-green-600", label: "Due Date", description: "Contract expires or is renewed" },
];

export default function AutomaticRenewalReminders() {
  return (
    <div className="mx-8 mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-gray-900">Automatic Renewal Reminders</h3>
      <p className="mb-6 text-sm text-gray-500">
        We automatically send reminders before a maintenance contract expires.
      </p>

      <div className="flex items-center justify-between">
        {steps.map(({ icon: Icon, iconBg, label, description }, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center text-center">
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
                <Icon size={20} />
              </span>
              <p className="mt-2 text-sm font-medium text-gray-900">{label}</p>
              <p className="max-w-[120px] text-xs text-gray-500">{description}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 h-px flex-1 border-t border-dashed border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
