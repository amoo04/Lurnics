import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import PageHeader from "../../components/layout/PageHeader";
import LeadsStats from "../components/LeadsStats";
import LeadsBoard from "../components/LeadsBoard";
import LeadDetailPanel from "../components/LeadDetailPanel";
import LeadCreateForm from "../components/LeadCreateForm";
import { useLeads } from "../hooks/useLeads";

export default function Leads() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const { data, loading, error, refetch } = useLeads();
  const leads = data?.items ?? [];
  const selectedLead = leads.find((l) => l.id === selectedId);

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Leads"
          subtitle="Track and manage potential clients through your sales pipeline."
          action={
            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setCreating(true);
              }}
              className="flex items-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <Plus size={16} />
              Add Lead
            </button>
          }
        />
        <LeadsStats leads={leads} />

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1">
            <LeadsBoard
              leads={leads}
              loading={loading}
              error={error}
              selectedId={selectedId}
              onSelect={(id) => {
                setCreating(false);
                setSelectedId(id);
              }}
              onAdd={() => {
                setSelectedId(null);
                setCreating(true);
              }}
            />
          </div>
          {creating && (
            <div className="px-4 sm:px-0 lg:pr-8">
              <LeadCreateForm
                onCreated={() => {
                  setCreating(false);
                  refetch();
                }}
                onClose={() => setCreating(false)}
              />
            </div>
          )}
          {!creating && selectedLead && (
            <div className="px-4 sm:px-0 lg:pr-8">
              <LeadDetailPanel
                lead={selectedLead}
                onChanged={refetch}
                onDeleted={() => {
                  setSelectedId(null);
                  refetch();
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
