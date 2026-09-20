import { Plus } from "lucide-react";
import { LEAD_STAGES, type Lead } from "../api/leads.types";

interface LeadsBoardProps {
  leads: Lead[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export default function LeadsBoard({ leads, loading, error, selectedId, onSelect, onAdd }: LeadsBoardProps) {
  if (loading) return <p className="px-4 text-sm text-gray-500 sm:px-8">Loading leads…</p>;
  if (error) return <p className="px-4 text-sm text-red-500 sm:px-8">{error}</p>;

  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-6 sm:px-8">
      {LEAD_STAGES.map(({ value, label, dotColor }) => {
        const cards = leads.filter((l) => l.status === value);
        return (
          <div key={value} className="w-64 shrink-0">
            <div className="mb-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 text-sm">
              <span className={`h-2 w-2 rounded-full ${dotColor}`} />
              <span className="font-medium text-gray-900">{label}</span>
              <span className="text-gray-500">{cards.length}</span>
            </div>

            <div className="space-y-3">
              {cards.map((lead) => (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => onSelect(lead.id)}
                  className={`w-full rounded-lg border p-3 text-left ${
                    selectedId === lead.id
                      ? "border-orange-200 bg-orange-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  <p className="text-sm font-medium leading-tight text-gray-900">{lead.contactPerson}</p>
                  <p className="text-xs text-gray-500">{lead.companyName}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-500">
                      {lead.source ?? "—"}
                    </span>
                    <span className="font-medium text-gray-600">{lead.budgetRange ?? "—"}</span>
                  </div>
                </button>
              ))}

              <button
                type="button"
                onClick={onAdd}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 py-2.5 text-xs text-gray-500 hover:bg-gray-50"
              >
                <Plus size={14} />
                Add Lead
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
