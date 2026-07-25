import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Newspaper } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { fetchEmailTemplates } from "../hooks/useEmailTemplates";
import type { EmailTemplate } from "../api/email-templates.types";

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Templates",
  abandoned_cart: "Abandoned Cart",
  welcome: "Welcome",
  promotions: "Promotions",
  re_engagement: "Re-engagement",
};

export default function EmailTemplates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchEmailTemplates(category)
      .then(setTemplates)
      .finally(() => setLoading(false));
  }, [category]);

  const categories = ["all", ...Array.from(new Set(templates.map((t) => t.category)))];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Email Templates</h1>
        <p className="text-sm text-gray-500">Pick a template to start a new email campaign.</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              category === cat ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            {CATEGORY_LABELS[cat] ?? cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
      ) : templates.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
          <Newspaper size={32} className="text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-700">No templates in this category</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div key={template.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div
                className="mb-3 max-h-48 overflow-hidden rounded-lg border border-gray-100 bg-gray-50"
                style={{ transform: "scale(0.85)", transformOrigin: "top left", width: "117.6%" }}
              >
                <iframe title={template.name} srcDoc={template.html} className="h-48 w-full" sandbox="" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{template.name}</p>
              {template.description && <p className="mt-1 text-xs text-gray-500">{template.description}</p>}
              <button
                type="button"
                onClick={() => navigate(`/portal/email-marketing?templateId=${template.id}`)}
                className="mt-3 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
              >
                Use This Template
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
