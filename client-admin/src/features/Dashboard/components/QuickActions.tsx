import { Link } from "react-router-dom";
import { FilePlus, UserPlus, Receipt, CreditCard } from "lucide-react";

const actions = [
  { icon: FilePlus, label: "Add New Project", to: "/projects" },
  { icon: UserPlus, label: "Add New Client", to: "/clients" },
  { icon: Receipt, label: "Create Invoice", to: "/invoices" },
  { icon: CreditCard, label: "Record Payment", to: "/payments" },
];

export default function QuickActions() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="mb-4 font-semibold">Quick Actions</h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label, to }) => (
          <Link
            key={label}
            to={to}
            className="flex flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] py-4 text-center text-xs text-gray-300 hover:bg-white/5"
          >
            <Icon size={18} className="text-indigo-300" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
}
