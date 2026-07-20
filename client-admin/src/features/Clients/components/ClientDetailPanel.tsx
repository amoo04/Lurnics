import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, FolderKanban, Receipt, MessageSquare, FileText } from "lucide-react";
import type { Client } from "../api/clients.types";
import { useApiGet } from "../../../lib/useApi";
import { avatarColorFor, formatCurrency, getInitial } from "../../../lib/uiHelpers";
import type { Project } from "../../Projects/api/projects.types";

interface InvoiceWithPayments {
  id: string;
  amount: number;
  discount: number;
  tax: number;
  status: string;
  payments: { amount: number; status: string }[];
}

const STATUS_COLOR: Record<string, string> = {
  active: "bg-green-50 text-green-600",
  inactive: "bg-gray-100 text-gray-600",
};

const quickActions = [
  { icon: FolderKanban, label: "View Projects", to: "/projects" },
  { icon: Receipt, label: "View Invoices", to: "/invoices" },
  { icon: MessageSquare, label: "Send Message", to: "/messages" },
  { icon: FileText, label: "View Documents", to: "/documents" },
];

export default function ClientDetailPanel({ client }: { client: Client }) {
  const { data: projectsData } = useApiGet<{ items: Project[] }>(`/api/projects?clientId=${client.id}&limit=3`);
  const { data: invoicesData } = useApiGet<{ items: InvoiceWithPayments[] }>(
    `/api/invoices?clientId=${client.id}&limit=100`,
  );

  const invoices = invoicesData?.items ?? [];
  const totalRevenue = invoices.reduce(
    (sum, inv) => sum + inv.payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0),
    0,
  );
  const outstanding = invoices.reduce((sum, inv) => {
    const paid = inv.payments.filter((p) => p.status === "completed").reduce((s, p) => s + p.amount, 0);
    const due = inv.amount - inv.discount + inv.tax;
    return sum + Math.max(0, due - paid);
  }, 0);

  return (
    <div className="w-full lg:w-80 lg:shrink-0 space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-lg text-sm font-bold ${avatarColorFor(client.companyName)}`}
          >
            {getInitial(client.companyName)}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-gray-900">{client.companyName}</p>
              <span className={`rounded-full px-2 py-0.5 text-xs ${STATUS_COLOR[client.status]}`}>
                {client.status}
              </span>
            </div>
            <p className="text-xs text-gray-500">{client.contactPerson}</p>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-gray-600">
          {client.email && (
            <p className="flex items-center gap-2">
              <Mail size={14} />
              {client.email}
            </p>
          )}
          {client.phone && (
            <p className="flex items-center gap-2">
              <Phone size={14} />
              {client.phone}
            </p>
          )}
          {client.address && (
            <p className="flex items-center gap-2">
              <MapPin size={14} />
              {client.address}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-gray-900">Summary</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-gray-500">Total Revenue</p>
            <p className="font-semibold text-gray-900">{formatCurrency(totalRevenue)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Outstanding</p>
            <p className="font-semibold text-orange-500">{formatCurrency(outstanding)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">Recent Projects</p>
          <Link to="/projects" className="text-xs text-orange-500">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {(projectsData?.items ?? []).length === 0 && <p className="text-xs text-gray-500">No projects yet.</p>}
          {(projectsData?.items ?? []).map((p) => (
            <div key={p.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-900">{p.projectName}</span>
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs capitalize text-orange-500">
                  {p.status}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-orange-500" style={{ width: `${p.progress}%` }} />
                </div>
                <span className="text-xs text-gray-500">{p.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-gray-900">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map(({ icon: Icon, label, to }) => (
            <Link
              key={label}
              to={to}
              className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-xs text-gray-600 hover:bg-gray-50"
            >
              <Icon size={14} className="text-orange-500" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
