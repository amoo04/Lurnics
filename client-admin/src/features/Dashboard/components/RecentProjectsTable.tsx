import { Link } from "react-router-dom";
import { useRecentProjects } from "../hooks/useDashboard";
import { avatarColorFor, formatDate } from "../../../lib/uiHelpers";

export default function RecentProjectsTable() {
  const { data, loading, error } = useRecentProjects();
  const projects = data?.items ?? [];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Recent Projects</h3>
        <Link to="/projects" className="text-xs text-indigo-400">
          View All
        </Link>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && projects.length === 0 && <p className="text-sm text-gray-500">No projects yet.</p>}

      {projects.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs text-gray-500">
              <th className="py-2 font-medium">Project</th>
              <th className="py-2 font-medium">Client</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">Progress</th>
              <th className="py-2 font-medium">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-b border-white/5">
                <td className="py-3 text-gray-200">{p.projectName}</td>
                <td className="py-3 text-gray-400">{p.client?.companyName ?? "—"}</td>
                <td className="py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${avatarColorFor(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-indigo-400" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{p.progress}%</span>
                  </div>
                </td>
                <td className="py-3 text-gray-400">{formatDate(p.dueDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
