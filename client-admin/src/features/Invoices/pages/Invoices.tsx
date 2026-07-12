import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import InvoicesStats from "../components/InvoicesStats";
import InvoicesTable from "../components/InvoicesTable";
import InvoiceDetailPanel from "../components/InvoiceDetailPanel";
import InvoiceCreateForm from "../components/InvoiceCreateForm";
import { useInvoices } from "../hooks/useInvoices";

export default function Invoices() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, loading, error, refetch } = useInvoices({ page, limit, search, status });
  const invoices = data?.items ?? [];
  const selectedInvoice = invoices.find((i) => i.id === selectedId);

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Invoices"
          subtitle="Manage all invoices, payments and billing."
          action={
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex items-center gap-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 text-sm font-medium text-white"
            >
              <Plus size={16} />
              Create Invoice
            </button>
          }
        />
        <InvoicesStats />

        {creating && (
          <InvoiceCreateForm
            onCreated={() => {
              setCreating(false);
              refetch();
            }}
            onClose={() => setCreating(false)}
          />
        )}

        <div className="flex flex-col gap-6 px-4 pb-8 sm:px-8 lg:flex-row">
          <div className="min-w-0 flex-1">
            <InvoicesTable
              invoices={invoices}
              loading={loading}
              error={error}
              selectedId={selectedId}
              onSelect={setSelectedId}
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
              limit={limit}
              onPageChange={setPage}
              onChanged={() => {
                if (selectedId) setSelectedId(null);
                refetch();
              }}
            />
          </div>
          {selectedInvoice && (
            <InvoiceDetailPanel invoice={selectedInvoice} onClose={() => setSelectedId(null)} />
          )}
        </div>
      </div>
    </div>
  );
}
