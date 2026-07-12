import { Code2, Cloud, Cog, TrendingUp, Megaphone, Rocket, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Code2,
    iconBg: "bg-indigo-500/20 text-indigo-400",
    title: "Software Engineering",
    description: "Custom software solutions engineered for performance, scalability, and business impact.",
    items: ["Web Application Development", "Enterprise Systems", "Mobile Application Development", "API Development & Integration", "Legacy System Modernization"],
  },
  {
    icon: Cloud,
    iconBg: "bg-blue-500/20 text-blue-400",
    title: "Digital Infrastructure",
    description: "We build secure, reliable, and scalable infrastructure that supports your business operations.",
    items: ["Cloud Infrastructure", "DevOps & CI/CD", "System Architecture", "Database Design & Management", "Security & Compliance"],
  },
  {
    icon: Cog,
    iconBg: "bg-green-500/20 text-green-400",
    title: "Business Automation",
    description: "Automate workflows, reduce manual work, and increase operational efficiency.",
    items: ["Workflow Automation", "Process Optimization", "Integration & Automation", "Data Management", "Business Intelligence"],
  },
  {
    icon: TrendingUp,
    iconBg: "bg-purple-500/20 text-purple-400",
    title: "Digital Transformation",
    description: "We help businesses adopt the right technologies and transform their operations for the future.",
    items: ["Digital Strategy", "Technology Roadmap", "Change Management", "Process Digitization", "Innovation Consulting"],
  },
  {
    icon: Megaphone,
    iconBg: "bg-blue-500/20 text-blue-400",
    title: "Digital Marketing",
    description: "Data-driven marketing strategies that increase visibility, generate leads, and grow your brand.",
    items: ["SEO (Search Engine Optimization)", "SEM (Search Engine Marketing)", "Social Media Marketing", "Content Strategy", "Lead Generation"],
  },
  {
    icon: Rocket,
    iconBg: "bg-teal-500/20 text-teal-400",
    title: "Brand & Digital Identity",
    description: "Create a strong brand and digital experience that builds trust and communicates value.",
    items: ["Brand Strategy", "UI/UX Design", "Web Design", "Corporate Identity", "Experience Design"],
  },
];

export default function CoreServices() {
  return (
    <section className="px-4 sm:px-8 md:px-20 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          What We Do
        </p>
        <h2 className="mt-2 text-3xl font-semibold">Our Core Services</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
          End-to-end services designed to help your business operate
          smarter, scale faster, and lead in a digital-first world.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map(({ icon: Icon, iconBg, title, description, items }) => (
          <div
            key={title}
            className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-6"
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
            <Link
              to="/contact"
              aria-label={`Discuss ${title}`}
              className="mt-6 flex h-9 w-9 items-center justify-center self-end rounded-full border border-white/10 bg-white/5"
            >
              <ArrowRight size={16} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
