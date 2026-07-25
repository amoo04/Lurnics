import { useState } from "react";
import { Search } from "lucide-react";
import type { Project } from "../api/projects.types";
import { deleteProject } from "../hooks/useProjects";
import { formatCurrency, formatDate } from "../../lib/uiHelpers";
import { ApiError } from "../../lib/api";

interface ProjectsTableProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  search: string;
  onSearchChange: (v: string) => void;
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (p: number) => void;
  onChanged: () => void;
}

export default function ProjectsTable({
  projects,
  loading,
  error,
  search,
  onSearchChange,
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onChanged,
}: ProjectsTableProps) {
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this project? This can't be undone.")) return;
    try {
      await deleteProject(id);
      onChanged();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete project");
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">All Projects</h3>
        <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-500">
          <Search size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects..."
            className="w-40 bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && projects.length === 0 && <p className="text-sm text-gray-500">No projects found.</p>}

      {projects.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-xs text-gray-500">
                <th className="py-2 font-medium">Project</th>
                <th className="py-2 font-medium">Client</th>
                <th className="py-2 font-medium">Status</th>
                <th className="py-2 font-medium">Progress</th>
                <th className="py-2 font-medium">Due Date</th>
                <th className="py-2 font-medium">Budget</th>
                <th className="py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 text-gray-900">{p.projectName}</td>
                  <td className="py-3 text-gray-500">{p.client?.companyName ?? "—"}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs capitalize text-orange-600">
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-orange-500" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-500">{formatDate(p.dueDate)}</td>
                  <td className="py-3 text-gray-500">{p.budget != null ? formatCurrency(p.budget) : "—"}</td>
                  <td className="relative py-3 text-gray-500">
                    <button type="button" onClick={() => setMenuOpenFor(menuOpenFor === p.id ? null : p.id)} className="px-2">
                      ···
                    </button>
                    {menuOpenFor === p.id && (
                      <div className="absolute right-0 top-8 z-10 w-32 rounded-md border border-gray-200 bg-white py-1 text-xs shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpenFor(null);
                            handleDelete(p.id);
                          }}
                          className="block w-full px-3 py-2 text-left text-red-500 hover:bg-gray-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 0 && (
        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} projects
          </span>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`h-8 w-8 rounded-md text-sm ${
                  p === page ? "bg-gray-900 text-white" : "border border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
