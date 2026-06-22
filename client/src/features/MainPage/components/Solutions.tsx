import { Code2, Cloud, TrendingUp, ArrowRight } from "lucide-react";

const solutions = [
  {
    icon: Code2,
    iconBg: "bg-indigo-500/20 text-indigo-400",
    title: "Software Engineering",
    description:
      "Custom software solutions built with precision, scalability, and performance in mind.",
    items: [
      "Web Applications",
      "Enterprise Systems",
      "Mobile Applications",
      "API Development",
      "Backend Systems",
    ],
    border: "border-white/10",
  },
  {
    icon: Cloud,
    iconBg: "bg-blue-500/20 text-blue-400",
    title: "Digital Infrastructure",
    description:
      "Robust infrastructure and automation that power your business operations.",
    items: [
      "Cloud Infrastructure",
      "Business Automation",
      "Data Systems",
      "Monitoring & Analytics",
      "Security & Compliance",
    ],
    border: "border-white/10",
  },
  {
    icon: TrendingUp,
    iconBg: "bg-green-500/20 text-green-400",
    title: "Business Transformation",
    description:
      "Aligning technology with strategy to drive efficiency, innovation, and growth.",
    items: [
      "Process Optimization",
      "Digital Strategy",
      "Technology Consulting",
      "Operational Efficiency",
    ],
    border: "border-green-500/30",
  },
];

export default function Solutions() {
  return (
    <section className="px-20 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          What We Engineer
        </p>
        <h2 className="mt-2 text-3xl font-semibold">
          Solutions that solve real business problems.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {solutions.map(({ icon: Icon, iconBg, title, description, items, border }) => (
          <div
            key={title}
            className={`flex flex-col justify-between rounded-xl border ${border} bg-white/[0.03] p-6`}
          >
            <div>
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon size={20} />
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-400">{description}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <ArrowRight size={14} className="text-gray-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="mt-6 flex h-9 w-9 items-center justify-center self-end rounded-md border border-white/10 bg-white/5"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
