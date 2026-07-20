import { Zap, Share2, Shield, Briefcase } from "lucide-react";

const features = [
  { icon: Zap, title: "Results-Driven", description: "Focused on measurable business outcomes" },
  { icon: Share2, title: "Scalable by Design", description: "Built to grow with your business" },
  { icon: Shield, title: "Secure & Reliable", description: "Enterprise-grade security and reliability" },
  { icon: Briefcase, title: "Long-term Partner", description: "We grow when you grow" },
];

export default function TransformationBar() {
  return (
    <section className="px-4 sm:px-8 md:px-20 py-10">
      <div className="flex flex-col items-center justify-between gap-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm md:flex-row">
        <div className="max-w-xs">
          <h2 className="text-xl font-semibold text-gray-900">
            Not just solutions. Business transformation.
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            We don't just deliver technology — we deliver outcomes that
            transform how your business operates and grows.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-orange-200 text-orange-500">
                <Icon size={18} />
              </div>
              <p className="text-sm font-medium text-gray-900">{title}</p>
              <p className="mt-1 max-w-[120px] text-xs text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
