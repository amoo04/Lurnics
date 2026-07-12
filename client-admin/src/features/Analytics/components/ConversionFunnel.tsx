const stages = [
  { label: "Website Visitors", value: 12480, color: "bg-indigo-400" },
  { label: "Leads Captured", value: 142, color: "bg-emerald-400" },
  { label: "Contacted", value: 96, color: "bg-yellow-400" },
  { label: "Proposal Sent", value: 54, color: "bg-orange-400" },
  { label: "Won", value: 21, color: "bg-pink-400" },
];

const max = stages[0].value;

export default function ConversionFunnel() {
  return (
    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="mb-5 font-semibold">Conversion Funnel</h3>

      <div className="space-y-4">
        {stages.map(({ label, value, color }, i) => {
          const widthPct = Math.max((value / max) * 100, 6);
          const prevValue = i > 0 ? stages[i - 1].value : null;
          const stepRate = prevValue ? Math.round((value / prevValue) * 100) : null;
          return (
            <div key={label}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-gray-300">{label}</span>
                <span className="flex items-center gap-2 text-gray-500">
                  {stepRate !== null && <span className="text-xs">{stepRate}% of prev.</span>}
                  <span className="font-semibold text-gray-200">{value.toLocaleString()}</span>
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${widthPct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
