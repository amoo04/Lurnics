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
  if (error) return <p className="px-4 text-sm text-red-400 sm:px-8">{error}</p>;

  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-6 sm:px-8">
      {LEAD_STAGES.map(({ value, label, dotColor }) => {
        const cards = leads.filter((l) => l.status === value);
        return (
          <div key={value} className="w-64 shrink-0">
            <div className="mb-3 flex items-center gap-2 text-sm">
              <span className={`h-2 w-2 rounded-full ${dotColor}`} />
              <span className="font-medium">{label}</span>
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
                      ? "border-indigo-400/50 bg-indigo-500/10"
                      : "border-white/10 bg-white/[0.03] hover:bg-white/5"
                  }`}
                >
                  <p className="text-sm font-medium leading-tight">{lead.contactPerson}</p>
                  <p className="text-xs text-gray-500">{lead.companyName}</p>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-gray-400">
                      {lead.source ?? "—"}
                    </span>
                    <span className="font-medium text-gray-300">{lead.budgetRange ?? "—"}</span>
                  </div>
                </button>
              ))}

              <button
                type="button"
                onClick={onAdd}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/10 py-2.5 text-xs text-gray-500 hover:bg-white/5"
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
