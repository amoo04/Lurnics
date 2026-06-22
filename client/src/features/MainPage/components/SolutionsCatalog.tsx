import {
  LayoutGrid,
  Layers,
  Target,
  Cog,
  BarChart3,
  Cloud,
  Shield,
  TrendingUp,
  ChevronRight,
  Monitor,
  Users,
  ShoppingCart,
  Package,
  Truck,
  Smartphone,
  Check,
  ArrowRight,
} from "lucide-react";

const categories = [
  { icon: LayoutGrid, label: "All Solutions", active: true },
  { icon: Layers, label: "Business Systems" },
  { icon: Target, label: "Customer Experience" },
  { icon: Cog, label: "Operations & Automation" },
  { icon: BarChart3, label: "Data & Analytics" },
  { icon: Cloud, label: "Cloud & Infrastructure" },
  { icon: Shield, label: "Security & Compliance" },
  { icon: TrendingUp, label: "Growth & Marketing" },
];

const solutions = [
  {
    icon: Monitor,
    iconBg: "bg-indigo-500/20 text-indigo-400",
    title: "Custom Business Applications",
    description: "Tailored software solutions that address your unique business processes and challenges.",
    items: ["Web Applications", "Enterprise Software", "Workflow Systems"],
  },
  {
    icon: Users,
    iconBg: "bg-purple-500/20 text-purple-400",
    title: "Enterprise Management Systems",
    description: "Integrated platforms to manage your entire business from one centralized system.",
    items: ["ERP Solutions", "HR Management", "Financial Management"],
  },
  {
    icon: ShoppingCart,
    iconBg: "bg-blue-500/20 text-blue-400",
    title: "E-Commerce Solutions",
    description: "Scalable e-commerce platforms that deliver exceptional shopping experiences and drive sales.",
    items: ["Online Stores", "Marketplace Platforms", "Subscription Systems"],
  },
  {
    icon: Users,
    iconBg: "bg-teal-500/20 text-teal-400",
    title: "CRM & Customer Engagement",
    description: "Build stronger relationships and streamline your sales, marketing, and support processes.",
    items: ["CRM Development", "Lead Management", "Customer Support Systems"],
  },
  {
    icon: Package,
    iconBg: "bg-indigo-500/20 text-indigo-400",
    title: "Inventory & Operations Systems",
    description: "Optimize inventory, streamline operations, and improve supply chain efficiency.",
    items: ["Inventory Management", "Order Management", "Supply Chain Solutions"],
  },
  {
    icon: Truck,
    iconBg: "bg-blue-500/20 text-blue-400",
    title: "Logistics & Delivery Platforms",
    description: "End-to-end logistics solutions that optimize routes, tracking, and delivery management.",
    items: ["Fleet Management", "Route Optimization", "Real-time Tracking"],
  },
  {
    icon: Smartphone,
    iconBg: "bg-purple-500/20 text-purple-400",
    title: "Mobile Application Development",
    description: "Native and cross-platform mobile apps that engage users and accelerate your business.",
    items: ["iOS Development", "Android Development", "Cross-platform Apps"],
  },
  {
    icon: Cloud,
    iconBg: "bg-teal-500/20 text-teal-400",
    title: "API & System Integration",
    description: "Connect your systems and automate data flow across your business ecosystem.",
    items: ["API Development", "Third-party Integration", "System Migration"],
  },
];

export default function SolutionsCatalog() {
  return (
    <section className="px-20 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Our Solutions
        </p>
        <h2 className="mt-2 text-3xl font-semibold">
          Complete solutions for your business needs
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
          From strategy and design to development and deployment, we deliver
          solutions that drive growth and efficiency.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        <div className="space-y-1 rounded-xl border border-white/10 bg-white/[0.03] p-3">
          {categories.map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm ${
                active
                  ? "bg-indigo-500/20 text-white"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon size={16} />
                {label}
              </span>
              <ChevronRight size={14} />
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {solutions.map(({ icon: Icon, iconBg, title, description, items }) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-400">{description}</p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                {items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check size={14} className="text-indigo-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-4 flex items-center gap-1 text-sm font-medium text-indigo-400"
              >
                Learn more
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
