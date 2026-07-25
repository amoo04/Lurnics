import { Layers, TrendingUp, Handshake } from "lucide-react";

const points = [
  {
    icon: Layers,
    title: "Modern architecture.",
    description: "Cloud-native software built for reliability, performance, and scalability.",
  },
  {
    icon: TrendingUp,
    title: "Long-term thinking.",
    description:
      "We design systems that grow with your business instead of becoming another tool you'll outgrow.",
  },
  {
    icon: Handshake,
    title: "Partnership.",
    description:
      "We work closely with our clients from discovery through deployment and continuous improvement.",
  },
];

export default function WhyLurnics() {
  return (
    <section className="px-4 sm:px-8 md:px-20 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold text-gray-900">Why Businesses Choose LURNICS</h2>
        <p className="mt-2 text-sm font-medium text-orange-500">
          Software engineered for business outcomes.
        </p>
        <p className="mt-4 text-sm text-gray-600">
          We don't build software for the sake of technology. Every solution is designed to
          improve efficiency, reduce manual work, and support measurable business growth.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3">
        {points.map(({ icon: Icon, title, description }) => (
          <div key={title} className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
              <Icon size={20} />
            </div>
            <h3 className="font-semibold text-gray-900">{title}</h3>
            <p className="mt-2 text-sm text-gray-600">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
