import { Search } from "lucide-react";

export default function InsightsHero() {
  return (
    <section className="grid items-center gap-12 px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Insights
        </p>
        <h1 className="mt-3 text-5xl font-bold leading-tight">
          Ideas, strategies, and insights that drive{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            digital growth.
          </span>
        </h1>
        <p className="mt-6 max-w-md text-gray-400">
          Expert perspectives on software engineering, automation,
          infrastructure, and digital transformation.
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] px-4 py-3">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search insights, topics, or keywords..."
            className="w-full bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-gray-500 md:h-72">
        Illustration placeholder
      </div>
    </section>
  );
}
