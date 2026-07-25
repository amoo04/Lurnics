import { useLeadsFunnel } from "../hooks/useAnalytics";

const FUNNEL_ORDER: { status: string; label: string; color: string }[] = [
  { status: "new", label: "New", color: "bg-orange-400" },
  { status: "contacted", label: "Contacted", color: "bg-yellow-400" },
  { status: "proposal_sent", label: "Proposal Sent", color: "bg-amber-400" },
  { status: "won", label: "Won", color: "bg-emerald-400" },
];

export default function ConversionFunnel() {
  const { data, loading, error } = useLeadsFunnel();

  const countFor = (status: string) => data?.find((r) => r.status === status)?.count ?? 0;
  const stages = FUNNEL_ORDER.map((s) => ({ ...s, value: countFor(s.status) }));
  const lostCount = countFor("lost");
  const max = Math.max(...stages.map((s) => s.value), 1);

  return (
    <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 font-semibold text-gray-900">Conversion Funnel</h3>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && (
        <div className="space-y-4">
          {stages.map(({ label, value, color }, i) => {
            const widthPct = Math.max((value / max) * 100, value > 0 ? 6 : 0);
            const prevValue = i > 0 ? stages[i - 1].value : null;
            const stepRate = prevValue ? Math.round((value / prevValue) * 100) : null;
            return (
              <div key={label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="text-gray-600">{label}</span>
                  <span className="flex items-center gap-2 text-gray-500">
                    {stepRate !== null && <span className="text-xs">{stepRate}% of prev.</span>}
                    <span className="font-semibold text-gray-900">{value.toLocaleString()}</span>
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div className={`h-full rounded-full ${color}`} style={{ width: `${widthPct}%` }} />
                </div>
              </div>
            );
          })}

          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="mb-1.5 flex items-center justify-between text-sm">
              <span className="text-gray-600">Lost</span>
              <span className="font-semibold text-gray-900">{lostCount.toLocaleString()}</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-rose-400"
                style={{ width: `${Math.max((lostCount / max) * 100, lostCount > 0 ? 6 : 0)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
