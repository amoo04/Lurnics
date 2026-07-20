import { PROJECT_STATUSES, type Project } from "../api/projects.types";
import { updateProject } from "../hooks/useProjects";
import { avatarColorFor, formatDate, getInitial } from "../../../lib/uiHelpers";
import { ApiError } from "../../../lib/api";

const STATUS_META: Record<string, { label: string; dotColor: string }> = {
  discovery: { label: "Discovery", dotColor: "bg-orange-500" },
  development: { label: "Development", dotColor: "bg-blue-400" },
  testing: { label: "Testing", dotColor: "bg-yellow-400" },
  deployment: { label: "Deployment", dotColor: "bg-green-400" },
  completed: { label: "Completed", dotColor: "bg-gray-400" },
};

interface KanbanBoardProps {
  projects: Project[];
  loading: boolean;
  error: string | null;
  onChanged: () => void;
}

export default function KanbanBoard({ projects, loading, error, onChanged }: KanbanBoardProps) {
  async function handleMove(id: string, status: string) {
    try {
      await updateProject(id, { status });
      onChanged();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to update project status");
    }
  }

  if (loading) return <p className="px-4 text-sm text-gray-500 sm:px-8">Loading projects…</p>;
  if (error) return <p className="px-4 text-sm text-red-500 sm:px-8">{error}</p>;

  return (
    <div className="flex gap-4 overflow-x-auto px-4 pb-6 sm:px-8">
      {PROJECT_STATUSES.map((status) => {
        const meta = STATUS_META[status];
        const cards = projects.filter((p) => p.status === status);
        return (
          <div key={status} className="w-64 shrink-0">
            <div className="mb-3 flex items-center gap-2 rounded-md bg-gray-50 px-2 py-1.5 text-sm">
              <span className={`h-2 w-2 rounded-full ${meta.dotColor}`} />
              <span className="font-medium text-gray-900">{meta.label}</span>
              <span className="text-gray-500">{cards.length}</span>
            </div>

            <div className="space-y-3">
              {cards.map((project) => (
                <div key={project.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                  <div className="flex items-start gap-2">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold ${avatarColorFor(project.projectName)}`}
                    >
                      {getInitial(project.projectName)}
                    </span>
                    <div>
                      <p className="text-sm font-medium leading-tight text-gray-900">{project.projectName}</p>
                      <p className="text-xs text-gray-500">{project.client?.companyName ?? "—"}</p>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                      <div className="h-full rounded-full bg-orange-500" style={{ width: `${project.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-500">{project.progress}%</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-500">
                    <span>{formatDate(project.dueDate)}</span>
                    <select
                      value={project.status}
                      onChange={(e) => handleMove(project.id, e.target.value)}
                      className="rounded border border-gray-300 bg-white px-1.5 py-1 text-[11px] text-gray-700 outline-none focus:border-gray-900"
                    >
                      {PROJECT_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_META[s].label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              {cards.length === 0 && <p className="text-xs text-gray-400">No projects</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
