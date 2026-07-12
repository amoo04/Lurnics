import { Box, Zap, Globe, Users } from "lucide-react";

const stats = [
  {
    icon: Box,
    value: "120+",
    label: "Systems Built",
    description: "Scalable digital systems engineered for growth",
    color: "text-indigo-400",
  },
  {
    icon: Zap,
    value: "250+",
    label: "Processes Automated",
    description: "Helping businesses save time and reduce manual work",
    color: "text-purple-400",
  },
  {
    icon: Globe,
    value: "15+",
    label: "Industries Served",
    description: "Diverse industry experience. Global standards.",
    color: "text-blue-400",
  },
  {
    icon: Users,
    value: "98%",
    label: "Client Satisfaction",
    description: "Long-term partnerships built on trust and delivery",
    color: "text-green-400",
  },
];

export default function Stats() {
  return (
    <section className="px-4 sm:px-8 md:px-20 py-10">
      <div className="grid gap-8 rounded-xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 md:grid-cols-[1fr_2fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Trusted Infrastructure
            <br />
            For Modern Businesses
          </p>
          <p className="mt-4 max-w-xs text-xl">
            We build systems that power operations and drive real results.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map(({ icon: Icon, value, label, description, color }) => (
            <div key={label}>
              <Icon className={color} size={22} />
              <p className="mt-3 text-3xl font-bold">{value}</p>
              <p className="mt-1 text-sm font-medium">{label}</p>
              <p className="mt-1 text-xs text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
