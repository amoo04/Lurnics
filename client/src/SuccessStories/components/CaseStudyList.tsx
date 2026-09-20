import { ArrowRight, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import type { CaseStudy } from "../api/success-stories.types";
import { ICONS_BY_SLUG, DEFAULT_INDUSTRY_ICON } from "../../lib/industryIcons";

interface CaseStudyListProps {
  caseStudies: CaseStudy[];
  loading: boolean;
  error: string | null;
}

export default function CaseStudyList({ caseStudies, loading, error }: CaseStudyListProps) {
  return (
    <div className="px-4 sm:px-8 md:px-20 pb-16">
      {loading && <p className="text-center text-sm text-gray-500">Loading success stories…</p>}
      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map(({ id, slug, title, summary, industry, featuredImage }) => {
          const { icon: Icon, iconBg } = industry
            ? (ICONS_BY_SLUG[industry.slug] ?? DEFAULT_INDUSTRY_ICON)
            : DEFAULT_INDUSTRY_ICON;

          return (
            <div
              key={id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              {featuredImage ? (
                <img src={featuredImage} alt={title} className="h-36 w-full object-cover" />
              ) : (
                <div className="flex h-36 items-center justify-center bg-gray-50 text-gray-500">
                  <Monitor size={32} className="opacity-40" />
                </div>
              )}

              <div className="flex flex-1 flex-col p-6">
                {industry && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                    {industry.name}
                  </p>
                )}
                <div className={`mt-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon size={20} />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{title}</h3>
                {summary && <p className="mt-2 flex-1 text-sm text-gray-600">{summary}</p>}

                <Link
                  to={`/case-studies/${slug}`}
                  className="mt-5 flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
                >
                  View Success Story
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
