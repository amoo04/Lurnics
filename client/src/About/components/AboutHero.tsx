import { ArrowRight, Play, Box, Users, Globe, Code2, Cloud, Cog, TrendingUp, Building2, Sparkles } from "lucide-react";
import OrbitVisual from "../../components/shared/OrbitVisual";
import HeroBackground from "../../components/shared/HeroBackground";

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
  { icon: Code2, value: "Engineering-Led", label: "Built the Right Way", description: "Every solution is architected with software engineering best practices" },
];

export default function AboutHero() {
  return (
    <>
      <section className="relative overflow-hidden">
        <HeroBackground />
        <div className="relative grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-medium text-orange-600">
              <Sparkles size={13} />
              About Lurnics
            </div>
            <h1 className="mt-5 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl">
              We partner with businesses to design, build, and maintain{" "}
              <span className="text-orange-500">
                software that grows with them.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-gray-600">
              We design, build, and maintain software that solves operational challenges and supports long-term growth.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="#story"
                className="flex items-center gap-2 rounded-md bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-gray-900/10 transition hover:-translate-y-0.5 hover:bg-black hover:shadow-xl"
              >
                Our Story
                <ArrowRight size={16} />
              </a>
              <a
                href="#mission"
                className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-900 transition hover:-translate-y-0.5 hover:bg-gray-50"
              >
                Our Mission
                <Play size={14} />
              </a>
            </div>
          </div>

          <div className="mx-auto">
            <OrbitVisual centerIcon={Building2} nodes={nodes} size={380} />
          </div>
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
