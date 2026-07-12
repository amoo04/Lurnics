import { Mail, CheckCircle2 } from "lucide-react";

const steps = [
  { icon: Mail, iconBg: "bg-indigo-500/20 text-indigo-300", label: "90 Days Before", description: "Email reminder sent to client" },
  { icon: Mail, iconBg: "bg-indigo-500/20 text-indigo-300", label: "30 Days Before", description: "Second reminder sent to client" },
  { icon: Mail, iconBg: "bg-yellow-500/20 text-yellow-300", label: "7 Days Before", description: "Third reminder sent to client" },
  { icon: Mail, iconBg: "bg-red-500/20 text-red-300", label: "1 Day Before", description: "Final reminder sent to client" },
  { icon: CheckCircle2, iconBg: "bg-green-500/20 text-green-300", label: "Due Date", description: "Contract expires or is renewed" },
];

export default function AutomaticRenewalReminders() {
  return (
    <div className="mx-8 mb-8 rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="font-semibold">Automatic Renewal Reminders</h3>
      <p className="mb-6 text-sm text-gray-400">
        We automatically send reminders before a maintenance contract expires.
      </p>

      <div className="flex items-center justify-between">
        {steps.map(({ icon: Icon, iconBg, label, description }, i) => (
          <div key={label} className="flex flex-1 items-center">
            <div className="flex flex-col items-center text-center">
              <span className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}>
                <Icon size={20} />
              </span>
              <p className="mt-2 text-sm font-medium">{label}</p>
              <p className="max-w-[120px] text-xs text-gray-500">{description}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2 h-px flex-1 border-t border-dashed border-white/15" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
