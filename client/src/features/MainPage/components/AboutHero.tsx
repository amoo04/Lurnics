import { ArrowRight, Play, Rocket, Users, Globe, Code2, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Rocket, value: "120+", label: "Projects Delivered", description: "Across diverse industries and business sizes" },
  { icon: Users, value: "85+", label: "Happy Clients", description: "Long-term partnerships built on trust" },
  { icon: Globe, value: "15+", label: "Industries Served", description: "Delivering solutions that create impact" },
  { icon: Code2, value: "50+", label: "Engineers & Creators", description: "Passionate experts building what matters" },
  { icon: ShieldCheck, value: "98%", label: "Client Satisfaction", description: "Our commitment to quality drives everything we do" },
];

export default function AboutHero() {
  return (
    <>
      <section className="grid items-center gap-12 px-20 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            About Lurnics
          </p>
          <h1 className="mt-3 text-5xl font-bold leading-tight">
            Engineering digital infrastructure that powers business{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              growth.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-gray-400">
            We design, build, and scale intelligent systems that help
            businesses automate operations, improve efficiency, and create
            lasting impact.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white"
            >
              Our Story
              <ArrowRight size={16} />
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-white/20 px-6 py-3 text-sm font-medium text-white"
            >
              Our Mission
              <Play size={14} />
            </button>
          </div>
        </div>

        <div className="flex h-64 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-sm text-gray-500 md:h-72">
          Globe visual placeholder
        </div>
      </section>

      <section className="px-20 pb-10">
        <div className="grid gap-6 rounded-xl border border-white/10 bg-white/[0.03] p-8 md:grid-cols-5">
          {stats.map(({ icon: Icon, value, label, description }) => (
            <div key={label} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-indigo-300">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-lg font-bold">{value}</p>
                <p className="text-sm font-medium">{label}</p>
                <p className="mt-1 text-xs text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
