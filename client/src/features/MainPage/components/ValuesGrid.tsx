import { Users, Star, Zap, Shield, HeartHandshake } from "lucide-react";

const values = [
  { icon: Users, title: "Client Success", description: "We are invested in your success and measure our growth by the impact we create for you." },
  { icon: Star, title: "Excellence", description: "We pursue excellence in every solution we build, with attention to detail and quality." },
  { icon: Zap, title: "Innovation", description: "We embrace new technologies and creative thinking to solve complex problems." },
  { icon: Shield, title: "Integrity", description: "We operate with honesty, transparency, and respect in every relationship." },
  { icon: HeartHandshake, title: "Long-term Partnership", description: "We build lasting partnerships and provide ongoing support as your business evolves." },
];

export default function ValuesGrid() {
  return (
    <section className="px-20 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Our Values
        </p>
        <h2 className="mt-2 text-3xl font-semibold">
          The principles that guide everything we do.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {values.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
              <Icon size={18} />
            </div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="mt-2 text-xs text-gray-400">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
