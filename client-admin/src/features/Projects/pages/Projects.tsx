import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import ProjectsStats from "../components/ProjectsStats";
import KanbanBoard from "../components/KanbanBoard";
import ProjectsTable from "../components/ProjectsTable";
import ProjectCreateForm from "../components/ProjectCreateForm";
import { useProjects } from "../hooks/useProjects";

export default function Projects() {
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const kanban = useProjects({ limit: 100 });
  const table = useProjects({ page, limit, search });

  function refetchAll() {
    kanban.refetch();
    table.refetch();
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Projects"
          subtitle="Manage all client projects, milestones, deliverables and deployments."
          action={
            <button
              type="button"
              onClick={() => setCreating(true)}
              className="flex items-center gap-1.5 rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
            >
              <Plus size={14} />
              Add Project
            </button>
          }
        />
        <ProjectsStats />

        {creating && (
          <div className="mb-6">
            <ProjectCreateForm
              onCreated={() => {
                setCreating(false);
                refetchAll();
              }}
              onClose={() => setCreating(false)}
            />
          </div>
        )}

        <KanbanBoard
          projects={kanban.data?.items ?? []}
          loading={kanban.loading}
          error={kanban.error}
          onChanged={refetchAll}
        />
        <div className="px-4 pb-8 sm:px-8">
          <ProjectsTable
            projects={table.data?.items ?? []}
            loading={table.loading}
            error={table.error}
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            page={page}
            totalPages={table.data?.pagination.totalPages ?? 1}
            total={table.data?.pagination.total ?? 0}
            limit={limit}
            onPageChange={setPage}
            onChanged={refetchAll}
          />
        </div>
      </div>
    </div>
  );
}
