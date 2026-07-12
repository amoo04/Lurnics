import { Monitor, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSolutions } from "../hooks/useContent";

export default function SolutionsCatalog() {
  const { data, loading, error } = useSolutions();
  const solutions = data?.items ?? [];

  return (
    <section className="px-4 sm:px-8 md:px-20 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Our Solutions
        </p>
        <h2 className="mt-2 text-3xl font-semibold">
          Complete solutions for your business needs
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
          From strategy and design to development and deployment, we deliver
          solutions that drive growth and efficiency.
        </p>
      </div>

      {loading && <p className="text-center text-sm text-gray-500">Loading solutions…</p>}
      {error && <p className="text-center text-sm text-red-400">{error}</p>}
      {!loading && !error && solutions.length === 0 && (
        <p className="text-center text-sm text-gray-500">No solutions published yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {solutions.map(({ id, slug, name, description }) => (
          <div key={id} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
              <Monitor size={20} />
            </div>
            <h3 className="font-semibold">{name}</h3>
            {description && <p className="mt-2 text-sm text-gray-400">{description}</p>}
            <Link
              to={`/solutions/${slug}`}
              className="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-400"
            >
              Learn more
              <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
