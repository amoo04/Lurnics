import { ArrowRight, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "../api/main.types";
import { ICONS_BY_SLUG, DEFAULT_INDUSTRY_ICON } from "../lib/industryIcons";

interface CaseStudyListProps {
  caseStudies: CaseStudy[];
  loading: boolean;
  error: string | null;
}

export default function CaseStudyList({ caseStudies, loading, error }: CaseStudyListProps) {
  return (
    <div className="px-4 sm:px-8 md:px-20 pb-16">
      {loading && <p className="text-center text-sm text-gray-500">Loading case studies…</p>}
      {error && <p className="text-center text-sm text-red-400">{error}</p>}
      {!loading && !error && caseStudies.length === 0 && (
        <p className="text-center text-sm text-gray-500">No case studies found.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map(({ id, slug, title, summary, industry }) => {
          const { icon: Icon, iconBg } = industry
            ? (ICONS_BY_SLUG[industry.slug] ?? DEFAULT_INDUSTRY_ICON)
            : DEFAULT_INDUSTRY_ICON;

          return (
            <div
              key={id}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-indigo-900/40 to-blue-900/20 text-gray-500">
                <Monitor size={32} className="opacity-40" />
              </div>

              <div className="flex flex-1 flex-col p-6">
                {industry && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    {industry.name}
                  </p>
                )}
                <div className={`mt-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon size={20} />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                {summary && <p className="mt-2 flex-1 text-sm text-gray-400">{summary}</p>}

                <Link
                  to={`/case-studies/${slug}`}
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-indigo-400"
                >
                  View Case Study
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
