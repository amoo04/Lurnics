import { useState } from "react";
import { UserPlus } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import ClientsStats from "../components/ClientsStats";
import ClientsTable from "../components/ClientsTable";
import ClientDetailPanel from "../components/ClientDetailPanel";
import ClientCreateForm from "../components/ClientCreateForm";
import { useClients, deleteClient } from "../hooks/useClients";
import { ApiError } from "../../../lib/api";

export default function Clients() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useClients({ page, search, status });
  const clients = data?.items ?? [];
  const selectedClient = clients.find((c) => c.id === selectedId);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this client? This can't be undone.")) return;
    try {
      await deleteClient(id);
      if (selectedId === id) setSelectedId(null);
      refetch();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete client");
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Clients"
          subtitle="Manage all your clients and their projects in one place."
          action={
            <button
              type="button"
              onClick={() => {
                setSelectedId(null);
                setCreating(true);
              }}
              className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white"
            >
              <UserPlus size={16} />
              Add New Client
            </button>
          }
        />
        <ClientsStats />

        <div className="flex flex-col gap-6 px-4 pb-8 sm:px-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <ClientsTable
              clients={clients}
              loading={loading}
              error={error}
              selectedId={selectedId}
              onSelect={(id) => {
                setCreating(false);
                setSelectedId(id);
              }}
              onDelete={handleDelete}
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              status={status}
              onStatusChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              page={page}
              totalPages={data?.pagination.totalPages ?? 1}
              total={data?.pagination.total ?? 0}
              onPageChange={setPage}
            />
          </div>
          {creating && <ClientCreateForm onCreated={() => { setCreating(false); refetch(); }} onClose={() => setCreating(false)} />}
          {!creating && selectedClient && <ClientDetailPanel client={selectedClient} />}
        </div>
      </div>
    </div>
  );
}
