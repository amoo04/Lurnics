import { Cog, BarChart3, Puzzle, Shield, Cloud, ArrowUpRight, ArrowRight } from "lucide-react";

const badges = [
  { icon: Cog, label: "Automation", className: "left-1/3 top-0" },
  { icon: BarChart3, label: "Analytics", className: "right-0 top-6" },
  { icon: Puzzle, label: "Integration", className: "right-0 top-1/2" },
  { icon: ArrowUpRight, label: "Scalability", className: "right-6 bottom-0" },
  { icon: Cloud, label: "Cloud", className: "left-6 bottom-0" },
  { icon: Shield, label: "Security", className: "left-0 top-1/3" },
];

export default function SolutionsHero() {
  return (
    <section className="grid items-center gap-12 px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Solutions
        </p>
        <h1 className="mt-3 text-5xl font-bold leading-tight">
          Intelligent solutions.
          <br />
          Built for real business.
        </h1>
        <p className="mt-6 max-w-md text-gray-400">
          We build end-to-end digital solutions that solve complex business
          challenges, automate operations, and deliver measurable results.
        </p>
        <div className="mt-8 flex items-center gap-4">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white"
          >
            Book a Strategy Session
            <ArrowRight size={16} />
          </button>
          <button type="button" className="flex items-center gap-2 text-sm text-gray-300">
            Talk to our experts
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/20">
              <ArrowRight size={14} />
            </span>
          </button>
        </div>
      </div>

      <div className="relative hidden h-[320px] md:block">
        <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-md border border-indigo-400/40 bg-gradient-to-br from-indigo-500/30 to-blue-500/10 shadow-[0_0_50px_rgba(99,102,241,0.4)]" />
        <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 font-bold">
          L
        </div>

        {badges.map(({ icon: Icon, label, className }) => (
          <div
            key={label}
            className={`absolute flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm backdrop-blur ${className}`}
          >
            <Icon size={16} />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
