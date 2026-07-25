import { ArrowRight, Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { useCaseStudies } from "../hooks/useSuccessStories";

export default function CaseStudies() {
  const { data, loading, error } = useCaseStudies();
  const caseStudies = (data?.items ?? []).slice(0, 3);

  return (
    <section className="px-4 sm:px-8 md:px-20 py-16">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-wider text-orange-500">
        Featured Success Stories
      </p>

      {loading && <p className="text-center text-sm text-gray-500">Loading success stories…</p>}
      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      {!loading && !error && caseStudies.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {caseStudies.map(({ id, slug, title, summary, featuredImage }) => (
            <div key={id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
              {featuredImage ? (
                <img
                  src={featuredImage}
                  alt={title}
                  className="h-36 w-full rounded-t-xl object-cover"
                />
              ) : (
                <div className="flex h-36 items-center justify-center rounded-t-xl bg-gray-50 text-gray-400">
                  <Monitor size={32} className="opacity-40" />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {summary && <p className="mt-1 text-sm text-gray-600">{summary}</p>}

                <Link
                  to={`/case-studies/${slug}`}
                  className="mt-4 flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600"
                >
                  View Success Story
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
