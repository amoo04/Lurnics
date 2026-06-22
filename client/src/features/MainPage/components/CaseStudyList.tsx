import {
  Activity,
  Heart,
  Package,
  TrendingUp,
  Zap,
  Award,
  Users,
  Calendar,
  Briefcase,
  Star,
  Truck,
  DollarSign,
  CheckCircle2,
  Clock,
  type LucideIcon,
  ArrowRight,
} from "lucide-react";

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

interface CaseStudy {
  logoIcon: LucideIcon;
  logoBg: string;
  name: string;
  category: string;
  title: string;
  description: string;
  stats: Stat[];
  solution: string;
}

const caseStudies: CaseStudy[] = [
  {
    logoIcon: Activity,
    logoBg: "bg-green-500/20 text-green-400",
    name: "VEKTAR",
    category: "RETAIL · E-COMMERCE",
    title: "Vektar – E-commerce Platform",
    description:
      "We built a custom e-commerce platform for Vektar that streamlined product management, order processing, and customer experience.",
    stats: [
      { icon: Package, value: "280+", label: "Products Managed" },
      { icon: TrendingUp, value: "70%", label: "Increase in Operational Efficiency" },
      { icon: Zap, value: "3x", label: "Faster Order Processing" },
      { icon: Award, value: "98%", label: "Customer Satisfaction" },
    ],
    solution:
      "Custom admin dashboard, inventory management, secure payments, real-time order tracking, and analytics.",
  },
  {
    logoIcon: Heart,
    logoBg: "bg-purple-500/20 text-purple-400",
    name: "THERAPY PLATFORM",
    category: "HEALTHCARE · DIGITAL PLATFORM",
    title: "Therapy Platform – Supporting Better Mental Health",
    description:
      "A comprehensive digital platform connecting patients with therapists, managing sessions, assessments, and progress securely.",
    stats: [
      { icon: Users, value: "2,500+", label: "Active Users" },
      { icon: Calendar, value: "40%", label: "Increase in Session Bookings" },
      { icon: Briefcase, value: "85%", label: "Reduction in Admin Workload" },
      { icon: Star, value: "4.9/5", label: "User Rating" },
    ],
    solution:
      "Secure messaging, session scheduling, assessments, progress tracking, and analytics dashboard.",
  },
  {
    logoIcon: Package,
    logoBg: "bg-orange-500/20 text-orange-400",
    name: "LOGIX SYSTEMS",
    category: "LOGISTICS · OPERATIONS",
    title: "Logix Systems – Logistics Management Platform",
    description:
      "We developed a logistics solution that optimized fleet operations, real-time tracking, and delivery management.",
    stats: [
      { icon: Truck, value: "60%", label: "Reduction in Delivery Delays" },
      { icon: DollarSign, value: "35%", label: "Lower Operational Costs" },
      { icon: CheckCircle2, value: "99.8%", label: "On-time Delivery Rate" },
      { icon: Clock, value: "24/7", label: "Real-time Tracking" },
    ],
    solution:
      "Fleet management, route optimization, real-time tracking, automated alerts, and reporting system.",
  },
];

export default function CaseStudyList() {
  return (
    <div className="space-y-6 px-20 pb-16">
      {caseStudies.map(({ logoIcon: LogoIcon, logoBg, name, category, title, description, stats, solution }) => (
        <div key={name} className="grid gap-6 rounded-xl border border-white/10 bg-white/[0.03] p-6 md:grid-cols-[80px_280px_1fr]">
          <div className="flex flex-col items-center gap-2">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${logoBg}`}>
              <LogoIcon size={24} />
            </div>
            <p className="text-center text-xs font-medium tracking-wide">{name}</p>
          </div>

          <div className="flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-xs text-gray-500">
            Screenshot placeholder
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              {category}
            </p>
            <h3 className="mt-1 text-lg font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-gray-400">{description}</p>

            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex items-start gap-2">
                  <Icon size={16} className="mt-0.5 shrink-0 text-indigo-400" />
                  <div>
                    <p className="font-semibold">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs font-semibold text-indigo-400">Our Solution</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-gray-400">{solution}</p>
              <button
                type="button"
                className="flex shrink-0 items-center gap-1 text-sm font-medium text-indigo-400"
              >
                View Case Study
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
