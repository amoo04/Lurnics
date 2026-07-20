import { Search, Pencil, Code2, Rocket, TrendingUp, type LucideIcon } from "lucide-react";

export interface ProcessStep {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
}

const defaultSteps: ProcessStep[] = [
  {
    icon: Search,
    number: "01",
    title: "Discover",
    description: "We understand your business, challenges, and goals.",
  },
  {
    icon: Pencil,
    number: "02",
    title: "Design",
    description: "We map workflows and architect solutions that fit.",
  },
  {
    icon: Code2,
    number: "03",
    title: "Engineer",
    description: "We build scalable, secure, and high-performance systems.",
  },
  {
    icon: Rocket,
    number: "04",
    title: "Deploy",
    description: "We launch with precision and ensure a smooth transition.",
  },
  {
    icon: TrendingUp,
    number: "05",
    title: "Scale",
    description: "We support, optimize, and help you grow continuously.",
  },
];

interface ProcessProps {
  eyebrow?: string;
  heading?: string;
  steps?: ProcessStep[];
}

export default function Process({
  eyebrow = "Our Process",
  heading = "A proven process. Measurable results.",
  steps = defaultSteps,
}: ProcessProps) {
  return (
    <section className="px-4 sm:px-8 md:px-20 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-gray-900">{heading}</h2>
      </div>

      <div className="grid grid-cols-2 gap-y-10 md:grid-cols-5 md:gap-x-4">
        {steps.map(({ icon: Icon, number, title, description }) => (
          <div key={number} className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
              <Icon size={22} className="text-orange-500" />
            </div>
            <p className="text-xs text-gray-500">{number}</p>
            <p className="mt-1 font-medium text-gray-900">{title}</p>
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
