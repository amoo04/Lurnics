import {
  Heart,
  GraduationCap,
  ShoppingBag,
  Truck,
  Landmark,
  Building2,
  Cog,
  Briefcase,
  Check,
  ArrowRight,
} from "lucide-react";

const industries = [
  {
    icon: Heart,
    iconBg: "bg-pink-500/20 text-pink-400",
    title: "Healthcare",
    description: "Digital solutions that improve patient care, optimize operations, and ensure compliance.",
    items: ["Patient Management Systems", "Telemedicine Platforms", "Health Data Analytics", "Appointment & Scheduling"],
  },
  {
    icon: GraduationCap,
    iconBg: "bg-blue-500/20 text-blue-400",
    title: "Education",
    description: "Empowering institutions with smart systems that enhance learning and administration.",
    items: ["School Management Systems", "Learning Management Systems", "Student Information Systems", "Online Learning Platforms"],
  },
  {
    icon: ShoppingBag,
    iconBg: "bg-purple-500/20 text-purple-400",
    title: "Retail",
    description: "Drive sales, streamline inventory, and deliver exceptional customer experiences.",
    items: ["E-commerce Platforms", "Inventory Management", "POS & Billing Systems", "Customer Loyalty Solutions"],
  },
  {
    icon: Truck,
    iconBg: "bg-teal-500/20 text-teal-400",
    title: "Logistics",
    description: "Optimize logistics, track in real-time, and improve delivery efficiency across the chain.",
    items: ["Fleet Management Systems", "Route Optimization", "Warehouse Management", "Real-time Tracking"],
  },
  {
    icon: Landmark,
    iconBg: "bg-indigo-500/20 text-indigo-400",
    title: "Finance",
    description: "Secure, scalable, and compliant solutions for financial institutions and fintech companies.",
    items: ["Core Banking Systems", "Payment & Wallet Solutions", "Fraud Detection Systems", "Financial Reporting Tools"],
  },
  {
    icon: Building2,
    iconBg: "bg-purple-500/20 text-purple-400",
    title: "Real Estate",
    description: "Manage properties, clients, and transactions with intelligent real estate platforms.",
    items: ["Property Management Systems", "Listing & Marketplace Platforms", "CRM for Real Estate", "Document Management"],
  },
  {
    icon: Cog,
    iconBg: "bg-blue-500/20 text-blue-400",
    title: "Manufacturing",
    description: "Increase productivity, reduce waste, and automate operations with smart systems.",
    items: ["Production Management", "Inventory & Supply Chain", "Quality Control Systems", "Asset Management"],
  },
  {
    icon: Briefcase,
    iconBg: "bg-indigo-500/20 text-indigo-400",
    title: "Professional Services",
    description: "Streamline operations, manage projects, and deliver exceptional client experiences.",
    items: ["Project Management Tools", "Client Portal Solutions", "Workflow Automation", "Time & Billing Systems"],
  },
];

export default function IndustryGrid() {
  return (
    <section className="px-20 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Industries We Transform
        </p>
        <h2 className="mt-2 text-3xl font-semibold">
          Built for your industry. Designed for impact.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
          We understand the unique needs of your industry and build digital
          infrastructure that helps you streamline operations, reduce costs,
          and scale with confidence.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {industries.map(({ icon: Icon, iconBg, title, description, items }) => (
          <div
            key={title}
            className="flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div>
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-xs text-gray-400">{description}</p>
              <ul className="mt-4 space-y-2 text-xs text-gray-300">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={12} className="shrink-0 text-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="mt-4 flex items-center gap-1 self-start text-xs font-medium text-indigo-400"
            >
              Learn more
              <ArrowRight size={12} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
