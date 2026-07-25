import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import PageHeader from "../../components/layout/PageHeader";
import SuccessStoriesTable from "../components/SuccessStoriesTable";
import SuccessStoryForm from "../components/SuccessStoryForm";
import { useSuccessStories, deleteCaseStudy } from "../hooks/useSuccessStories";
import { ApiError } from "../../lib/api";
import type { CaseStudy } from "../api/success-stories.types";

export default function SuccessStories() {
  const { data, loading, error, refetch } = useSuccessStories();
  const [editing, setEditing] = useState<CaseStudy | null>(null);
  const [creating, setCreating] = useState(false);

  const caseStudies = data?.items ?? [];
  const showForm = creating || editing !== null;

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this success story? This can't be undone.")) return;
    try {
      await deleteCaseStudy(id);
      refetch();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete success story");
    }
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Success Stories"
          subtitle="Manage the project catalogue shown on the public Success Stories page."
          action={
            !showForm && (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
              >
                <Plus size={16} />
                New Success Story
              </button>
            )
          }
        />

        <div className="px-4 pb-8 sm:px-8">
          {showForm ? (
            <SuccessStoryForm
              caseStudy={editing}
              onSaved={() => {
                closeForm();
                refetch();
              }}
              onClose={closeForm}
            />
          ) : (
            <SuccessStoriesTable
              caseStudies={caseStudies}
              loading={loading}
              error={error}
              onEdit={setEditing}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
