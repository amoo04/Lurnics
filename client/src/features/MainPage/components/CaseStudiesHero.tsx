import { ArrowRight } from "lucide-react";

export default function CaseStudiesHero() {
  return (
    <section className="grid items-center gap-12 px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Case Studies
        </p>
        <h1 className="mt-3 text-5xl font-bold leading-tight">
          Real challenges.
          <br />
          Real solutions.{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Real impact.
          </span>
        </h1>
        <p className="mt-6 max-w-md text-gray-400">
          Explore how we partner with businesses to solve complex problems,
          build digital infrastructure, and deliver measurable results.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white"
          >
            Book a Strategy Session
            <ArrowRight size={16} />
          </button>
          <button type="button" className="flex items-center gap-1 text-sm text-gray-300">
            Have a project in mind?
            <span className="text-indigo-400">Let's Talk</span>
            <ArrowRight size={14} className="text-indigo-400" />
          </button>
        </div>
      </div>

      <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-gray-500 md:h-72">
        Dashboard preview placeholder
      </div>
    </section>
  );
}
