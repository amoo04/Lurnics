import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useProjectsByStatus } from "../hooks/useDashboard";

const COLORS = ["#f97316", "#34d399", "#60a5fa", "#f472b6", "#facc15"];

export default function ProjectsStatusDonut() {
  const { data, loading, error } = useProjectsByStatus();
  const total = data?.reduce((sum, d) => sum + d.count, 0) ?? 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Projects by Status</h3>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && total === 0 && <p className="text-sm text-gray-500">No projects yet.</p>}

      {data && total > 0 && (
        <>
          <div className="relative h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="count" nameKey="status" innerRadius={45} outerRadius={65} paddingAngle={2}>
                  {data.map((d, i) => (
                    <Cell key={d.status} fill={COLORS[i % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl font-bold text-gray-900">{total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>

          <ul className="mt-4 space-y-2 text-xs">
            {data.map((d, i) => (
              <li key={d.status} className="flex items-center justify-between">
                <span className="flex items-center gap-2 capitalize text-gray-700">
                  <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {d.status}
                </span>
                <span className="text-gray-500">
                  {d.count} ({Math.round((d.count / total) * 100)}%)
                </span>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
