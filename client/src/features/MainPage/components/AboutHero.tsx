import { ArrowRight, Play, Box, Users, Globe, Code2, Cloud, Cog, TrendingUp, Building2 } from "lucide-react";
import OrbitVisual from "./OrbitVisual";

const nodes = [
  { icon: Code2, title: "Software Engineering", subtitle: "Custom builds" },
  { icon: Cloud, title: "Digital Infrastructure", subtitle: "Reliable • Scalable" },
  { icon: Cog, title: "Business Automation", subtitle: "Workflows • Ops" },
  { icon: TrendingUp, title: "Digital Transformation", subtitle: "Strategy • Growth" },
  { icon: Users, title: "Client Partnership", subtitle: "Long-term • Trusted" },
  { icon: Globe, title: "Global Reach", subtitle: "Local • International" },
];

const stats = [
  { icon: Box, value: "3", label: "Platforms Shipped", description: "Live systems handling real customers and revenue" },
  { icon: Globe, value: "3", label: "Industries", description: "E-commerce, mental health, and luxury retail" },
  { icon: Code2, value: "100%", label: "Founder-Built", description: "Every line of code, every architecture decision, one engineer" },
];

export default function AboutHero() {
  return (
    <>
      <section className="grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            About Lurnics
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl">
            Engineering digital infrastructure that powers business{" "}
            <span className="text-orange-500">
              growth.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-gray-600">
            We design and build intelligent systems that help businesses grow.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <a
              href="#story"
              className="flex items-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-black"
            >
              Our Story
              <ArrowRight size={16} />
            </a>
            <a
              href="#mission"
              className="flex items-center gap-2 rounded-md border border-gray-300 px-6 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Our Mission
              <Play size={14} />
            </a>
          </div>
        </div>

        <div className="mx-auto">
          <OrbitVisual centerIcon={Building2} nodes={nodes} size={380} />
        </div>
      </section>

      <section className="px-4 sm:px-8 md:px-20 pb-10">
        <div className="grid gap-6 rounded-xl border border-gray-200 bg-white p-8 shadow-sm sm:grid-cols-3">
          {stats.map(({ icon: Icon, value, label, description }) => (
            <div key={label} className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <Icon size={16} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900">{value}</p>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="mt-1 text-xs text-gray-500">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
