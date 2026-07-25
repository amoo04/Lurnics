import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Search } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { fetchSeoAudit } from "../hooks/useSeo";
import type { SeoAudit } from "../api/seo.types";

function scoreColor(score: number) {
  if (score >= 80) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-red-600";
}

export default function SEO() {
  const [audit, setAudit] = useState<SeoAudit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeoAudit()
      .then(setAudit)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">SEO</h1>
        <p className="text-sm text-gray-500">
          A real on-page audit of your published pages — meta tags, content, and image alt text.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">Loading…</div>
      ) : !audit || audit.totalPages === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <Search size={32} className="text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-700">Nothing to audit yet</p>
          <p className="mt-1 max-w-sm text-sm text-gray-500">Publish at least one page to see your real SEO audit.</p>
          <Link
            to="/portal/pages"
            className="mt-5 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
          >
            Go to Pages
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-medium text-gray-500">SEO Score</p>
              <p className={`mt-2 text-3xl font-bold ${scoreColor(audit.score)}`}>{audit.score}</p>
              <p className="mt-1 text-xs text-gray-400">
                {audit.checksPassed} / {audit.checksTotal} checks passed
              </p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-medium text-gray-500">Pages Audited</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{audit.totalPages}</p>
              <p className="mt-1 text-xs text-gray-400">Published pages only</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-medium text-gray-500">Critical Issues</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{audit.criticalIssues}</p>
              <p className="mt-1 text-xs text-gray-400">Missing title or description</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="text-xs font-medium text-gray-500">Warnings</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{audit.warnings}</p>
              <p className="mt-1 text-xs text-gray-400">Suboptimal but present</p>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-4 text-sm font-semibold text-gray-900">Checklist</p>
              <div className="space-y-3">
                {audit.checklist.map((item) => {
                  const total = item.passCount + item.failCount;
                  const allPass = item.failCount === 0;
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      {allPass ? (
                        <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                      ) : (
                        <AlertTriangle size={16} className="shrink-0 text-amber-500" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm text-gray-700">{item.label}</p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {item.passCount}/{total} pages
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <p className="mb-4 text-sm font-semibold text-gray-900">Recommendations</p>
              {audit.recommendations.length === 0 ? (
                <p className="flex items-center gap-1.5 text-sm text-emerald-600">
                  <CheckCircle2 size={15} />
                  No issues found — nice work.
                </p>
              ) : (
                <div className="space-y-4">
                  {audit.recommendations.map((rec) => (
                    <div key={rec.label} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-gray-900">{rec.label}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{rec.detail}</p>
                      <p className="mt-1 text-xs text-gray-400">Affects: {rec.affectedPages.join(", ")}</p>
                    </div>
                  ))}
                </div>
              )}
              <Link
                to="/portal/pages"
                className="mt-4 block rounded-md bg-gray-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-black"
              >
                Edit Pages
              </Link>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
