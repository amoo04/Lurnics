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
    <section className="px-4 sm:px-8 md:px-20 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
          Our Values
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-gray-900">
          The principles that guide everything we do.
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {values.map(({ icon: Icon, title, description }) => (
          <div
            key={title}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
              <Icon size={18} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-xs text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
