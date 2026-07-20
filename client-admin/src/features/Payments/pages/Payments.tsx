import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import PaymentsStats from "../components/PaymentsStats";
import PaymentOverviewChart from "../components/PaymentOverviewChart";
import PaymentsByMethodDonut from "../components/PaymentsByMethodDonut";
import PaymentStatusOverview from "../components/PaymentStatusOverview";
import PaymentsActivity from "../components/PaymentsActivity";
import RecentTransactionsTable from "../components/RecentTransactionsTable";
import PaymentCreateForm from "../components/PaymentCreateForm";
import { usePayments } from "../hooks/usePayments";

export default function Payments() {
  const [creating, setCreating] = useState(false);
  const { data, loading, error, refetch } = usePayments({ limit: 100 });
  const payments = data?.items ?? [];

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Payments"
          subtitle="Track all payments received, pending and failed transactions."
          action={
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <Plus size={16} />
              Record Payment
            </button>
          }
        />
        <PaymentsStats payments={payments} />

        {creating && (
          <PaymentCreateForm
            onCreated={() => {
              setCreating(false);
              refetch();
            }}
            onClose={() => setCreating(false)}
          />
        )}

        <div className="grid gap-6 px-4 sm:px-8 pb-6 md:grid-cols-[2fr_320px]">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
              <PaymentOverviewChart payments={payments} />
              <PaymentsByMethodDonut payments={payments} />
            </div>
            <RecentTransactionsTable payments={payments} loading={loading} error={error} />
          </div>

          <div className="space-y-6">
            <PaymentStatusOverview payments={payments} />
            <PaymentsActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
