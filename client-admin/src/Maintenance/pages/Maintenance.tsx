import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import PageHeader from "../../components/layout/PageHeader";
import MaintenanceStats from "../components/MaintenanceStats";
import MaintenanceContractsTable from "../components/MaintenanceContractsTable";
import UpcomingExpirations from "../components/UpcomingExpirations";
import MaintenancePlans from "../components/MaintenancePlans";
import AutomaticRenewalReminders from "../components/AutomaticRenewalReminders";
import MaintenanceCreateForm from "../components/MaintenanceCreateForm";
import { useMaintenanceContracts } from "../hooks/useMaintenance";

export default function Maintenance() {
  const [creating, setCreating] = useState(false);
  const [initialPlan, setInitialPlan] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading, error, refetch } = useMaintenanceContracts({ page, search, status });
  const contracts = data?.items ?? [];

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Maintenance"
          subtitle="Manage all client maintenance contracts and renewals."
          action={
            <button
              type="button"
              onClick={() => {
                setInitialPlan(undefined);
                setCreating(true);
              }}
              className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <Plus size={16} />
              Add Maintenance
            </button>
          }
        />
        <MaintenanceStats contracts={contracts} />

        {creating && (
          <MaintenanceCreateForm
            initialPlan={initialPlan}
            onCreated={() => {
              setCreating(false);
              refetch();
            }}
            onClose={() => setCreating(false)}
          />
        )}

        <div className="grid gap-6 px-4 sm:px-8 pb-6 md:grid-cols-[2fr_320px]">
          <MaintenanceContractsTable
            contracts={contracts}
            loading={loading}
            error={error}
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
            onChanged={refetch}
          />
          <div className="space-y-6">
            <UpcomingExpirations contracts={contracts} />
            <MaintenancePlans
              onSelectPlan={(planName) => {
                setInitialPlan(planName);
                setCreating(true);
              }}
            />
          </div>
        </div>

        <AutomaticRenewalReminders />
      </div>
    </div>
  );
}
