import { Box, Globe, Code2 } from "lucide-react";

const stats = [
  {
    icon: Box,
    value: "5",
    label: "Platforms Shipped",
    description: "Live systems handling real customers and revenue",
    color: "text-orange-500",
  },
  {
    icon: Globe,
    value: "3",
    label: "Industries",
    description: "E-commerce, mental health, and luxury retail",
    color: "text-orange-500",
  },
  {
    icon: Code2,
    value: "Engineering-Led",
    label: "Built the Right Way",
    description:
      "Every solution is architected with software engineering best practices",
    color: "text-orange-500",
  },
];

export default function Stats() {
  return (
    <section className="px-4 sm:px-8 md:px-20 py-10">
      <div className="grid gap-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
            Built for Businesses
            <br />
            That Want to Scale
          </p>
          <p className="mt-4 max-w-xs text-xl text-gray-900">
            We build systems that power operations and drive real results.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map(({ icon: Icon, value, label, description, color }) => (
            <div key={label}>
              <Icon className={color} size={22} />
              <p className="mt-3 text-3xl font-bold text-gray-900">{value}</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{label}</p>
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
