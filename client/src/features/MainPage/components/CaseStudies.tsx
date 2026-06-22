import { ArrowRight } from "lucide-react";

const caseStudies = [
  {
    title: "Retail Transformation",
    description: "A complete e-commerce and inventory management system.",
    stats: [
      { value: "280+", label: "Products Managed" },
      { value: "70%", label: "Operational Efficiency" },
      { value: "3x", label: "Sales Growth" },
    ],
  },
  {
    title: "Healthcare Platform",
    description: "A therapy and consultation platform with assessments and messaging.",
    stats: [
      { value: "500+", label: "Users" },
      { value: "95%", label: "Client Satisfaction" },
      { value: "40%", label: "Time Saved" },
    ],
  },
  {
    title: "Operations Automation",
    description: "Automated workflows and business processes for a growing enterprise.",
    stats: [
      { value: "60%", label: "Manual Work Reduced" },
      { value: "2x", label: "Process Speed" },
      { value: "100%", label: "Data Accuracy" },
    ],
  },
];

export default function CaseStudies() {
  return (
    <section className="px-20 py-16">
      <p className="mb-8 text-center text-xs font-semibold uppercase tracking-wider text-indigo-400">
        Featured Case Studies
      </p>

      <div className="grid gap-6 md:grid-cols-3">
        {caseStudies.map(({ title, description, stats }) => (
          <div key={title} className="rounded-xl border border-white/10 bg-white/[0.03]">
            <div className="flex h-36 items-center justify-center rounded-t-xl bg-gray-700/40 text-sm text-gray-500">
              Image placeholder
            </div>
            <div className="p-5">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-gray-400">{description}</p>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-semibold">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="mt-4 flex items-center gap-1 text-sm text-indigo-400"
              >
                View Case Study
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
