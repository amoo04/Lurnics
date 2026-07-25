import { Search, FileText, Code2, Share2, TrendingUp, Shield, Monitor, Rocket } from "lucide-react";
import OrbitVisual from "../../components/shared/OrbitVisual";

const nodes = [
  { icon: Code2, title: "Engineering", subtitle: "Clean • Scalable" },
  { icon: Share2, title: "Automation", subtitle: "Streamlined Ops" },
  { icon: TrendingUp, title: "Business Strategy", subtitle: "Growth • Insight" },
  { icon: Shield, title: "Infrastructure", subtitle: "Secure • Reliable" },
  { icon: Monitor, title: "Productivity", subtitle: "Tools • Habits" },
  { icon: Rocket, title: "Digital Transformation", subtitle: "Modern • Agile" },
];

export default function InsightsHero() {
  return (
    <section className="grid items-center gap-12 px-4 sm:px-8 md:px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
          Insights
        </p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl md:text-6xl">
          Ideas, strategies, and insights that drive{" "}
          <span className="text-orange-500">digital growth.</span>
        </h1>
        <p className="mt-6 max-w-md text-gray-600">
          Perspectives on engineering, automation, and digital growth.
        </p>

        <div className="mt-8 flex items-center gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <Search size={16} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search insights, topics, or keywords..."
            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="mx-auto">
        <OrbitVisual centerIcon={FileText} nodes={nodes} size={380} />
      </div>
    </section>
  );
}
