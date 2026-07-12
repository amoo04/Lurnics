import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCaseStudies } from "../hooks/useContent";

export default function CaseStudies() {
  const { data, loading, error } = useCaseStudies();
  const caseStudies = (data?.items ?? []).slice(0, 3);

  return (
    <section className="px-4 sm:px-8 md:px-20 py-16">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-wider text-indigo-400">
        Featured Case Studies
      </p>

      {loading && <p className="text-center text-sm text-gray-500">Loading case studies…</p>}
      {error && <p className="text-center text-sm text-red-400">{error}</p>}
      {!loading && !error && caseStudies.length === 0 && (
        <p className="text-center text-sm text-gray-500">No case studies published yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {caseStudies.map(({ id, slug, title, summary }) => (
          <div key={id} className="rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="flex h-36 items-center justify-center rounded-t-xl bg-gray-700/40 text-sm text-gray-500">
              Image placeholder
            </div>
            <div className="p-5">
              <h3 className="font-semibold">{title}</h3>
              {summary && <p className="mt-1 text-sm text-gray-400">{summary}</p>}

              <Link
                to={`/case-studies/${slug}`}
                className="mt-4 flex items-center gap-1 text-sm text-indigo-400"
              >
                View Case Study
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
