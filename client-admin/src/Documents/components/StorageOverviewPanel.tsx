import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useApiGet } from "../../lib/useApi";

interface DocumentsReport {
  total: number;
  byType: { fileType: string; count: number }[];
  byClient: { clientId: string; companyName: string; count: number }[];
  recentCount: number;
}

const COLORS = ["#f97316", "#34d399", "#facc15", "#9ca3af", "#60a5fa", "#f472b6"];

export default function StorageOverviewPanel() {
  const { data, loading, error } = useApiGet<DocumentsReport>("/api/reports/documents");

  const byType = data?.byType ?? [];
  const total = data?.total ?? 0;
  const chartData = byType
    .slice()
    .sort((a, b) => b.count - a.count)
    .map((t, i) => ({ label: t.fileType.toUpperCase(), value: t.count, color: COLORS[i % COLORS.length] }));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Documents by Type</h3>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {!loading && !error && chartData.length === 0 && (
        <p className="text-sm text-gray-500">No documents yet.</p>
      )}

      {chartData.length > 0 && (
        <div className="flex items-center gap-4">
          <div className="relative h-28 w-28 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={36} outerRadius={52} paddingAngle={2}>
                  {chartData.map((d) => (
                    <Cell key={d.label} fill={d.color} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-sm font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-500">documents</p>
            </div>
          </div>

          <ul className="space-y-1.5 text-xs">
            {chartData.map(({ label, value, color }) => (
              <li key={label} className="flex items-center gap-2 text-gray-700">
                <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                {label}
                <span className="text-gray-500">{value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
