import { useState } from "react";
import { Plus } from "lucide-react";
import Sidebar from "../../../components/layout/Sidebar";
import Topbar from "../../../components/layout/Topbar";
import PageHeader from "../../../components/layout/PageHeader";
import InsightsStats from "../components/InsightsStats";
import InsightsTable from "../components/InsightsTable";
import InsightForm from "../components/InsightForm";
import { useInsights, deleteArticle } from "../hooks/useInsights";
import { ApiError } from "../../../lib/api";
import type { Article } from "../api/insights.types";

export default function Insights() {
  const { data, loading, error, refetch } = useInsights();
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false);

  const articles = data?.items ?? [];
  const showForm = creating || editingArticle !== null;

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this article? This can't be undone.")) return;
    try {
      await deleteArticle(id);
      refetch();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Failed to delete article");
    }
  }

  function closeForm() {
    setCreating(false);
    setEditingArticle(null);
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Topbar />
        <PageHeader
          title="Insights"
          subtitle="Manage the articles published on the public Insights page."
          action={
            !showForm && (
              <button
                type="button"
                onClick={() => setCreating(true)}
                className="flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
              >
                <Plus size={16} />
                New Article
              </button>
            )
          }
        />

        <InsightsStats />

        <div className="px-4 pb-8 sm:px-8">
          {showForm ? (
            <InsightForm
              article={editingArticle}
              onSaved={() => {
                closeForm();
                refetch();
              }}
              onClose={closeForm}
            />
          ) : (
            <InsightsTable
              articles={articles}
              loading={loading}
              error={error}
              onEdit={setEditingArticle}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>
    </div>
  );
}
