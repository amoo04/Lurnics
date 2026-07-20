import { useState } from "react";
import { Upload } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import DocumentsStats from "../components/DocumentsStats";
import DocumentsTable from "../components/DocumentsTable";
import DocumentCreateForm from "../components/DocumentCreateForm";
import StorageOverviewPanel from "../components/StorageOverviewPanel";
import QuickAccessPanel from "../components/QuickAccessPanel";
import RecentUploadsPanel from "../components/RecentUploadsPanel";
import { useDocuments, deleteDocument } from "../hooks/useDocuments";
import { ApiError } from "../../../lib/api";

const LIMIT = 10;

export default function Documents() {
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useDocuments({ page, limit: LIMIT, search, clientId });
  const documents = data?.items ?? [];

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this document? This can't be undone.")) return;
    try {
      await deleteDocument(id);
      refetch();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete document");
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Documents"
          subtitle="Store, organize and manage all your important files."
          action={
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <Upload size={16} />
              Add Document
            </button>
          }
        />
        <DocumentsStats />

        <div className="grid gap-6 px-4 sm:px-8 pb-8 md:grid-cols-[2fr_320px]">
          <div className="min-w-0 space-y-6">
            {clientId && (
              <div className="flex items-center justify-between rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-xs text-orange-700">
                <span>Filtering by selected client</span>
                <button type="button" onClick={() => { setClientId(undefined); setPage(1); }} className="underline">
                  Clear
                </button>
              </div>
            )}
            <DocumentsTable
              documents={documents}
              loading={loading}
              error={error}
              onDelete={handleDelete}
              search={search}
              onSearchChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              page={page}
              totalPages={data?.pagination.totalPages ?? 1}
              total={data?.pagination.total ?? 0}
              limit={LIMIT}
              onPageChange={setPage}
            />
          </div>
          <div className="space-y-6">
            {creating && (
              <DocumentCreateForm
                onCreated={() => {
                  setCreating(false);
                  refetch();
                }}
                onClose={() => setCreating(false)}
              />
            )}
            <StorageOverviewPanel />
            <QuickAccessPanel
              onSelectClient={(id) => {
                setClientId(id);
                setPage(1);
              }}
            />
            <RecentUploadsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
