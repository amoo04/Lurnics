import {
  Search,
  ClipboardList,
  Pencil,
  Code2,
  Bug,
  Rocket,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

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
    title: "Discovery",
    description: "We understand your business, challenges, and goals.",
  },
  {
    icon: ClipboardList,
    number: "02",
    title: "Planning",
    description: "We define scope, architecture, and a clear roadmap.",
  },
  {
    icon: Pencil,
    number: "03",
    title: "Design",
    description: "We map workflows and design the solution around them.",
  },
  {
    icon: Code2,
    number: "04",
    title: "Development",
    description: "We build scalable, secure, and high-performance systems.",
  },
  {
    icon: Bug,
    number: "05",
    title: "Testing",
    description: "We verify quality, performance, and reliability before launch.",
  },
  {
    icon: Rocket,
    number: "06",
    title: "Deployment",
    description: "We launch with precision and ensure a smooth transition.",
  },
  {
    icon: LifeBuoy,
    number: "07",
    title: "Support",
    description: "We stay on to maintain, optimize, and help you grow.",
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

      <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 lg:grid-cols-7 lg:gap-x-4">
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
