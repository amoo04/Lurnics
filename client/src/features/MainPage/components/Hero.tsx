import { Cloud, BarChart3, CreditCard, Code2, Users, ArrowRight } from "lucide-react";

const badges = [
  { icon: Cloud, label: "Cloud", className: "left-0 top-12" },
  { icon: BarChart3, label: "Analytics", className: "right-10 top-32" },
  { icon: CreditCard, label: "Payments", className: "left-10 top-44" },
  { icon: Code2, label: "API", className: "right-32 top-56" },
  { icon: Users, label: "Automation", className: "left-32 top-72" },
];

export default function Hero() {
  return (
    <section className="grid items-center gap-12 px-20 py-16 md:grid-cols-2">
      <div>
        <h1 className="text-5xl font-bold leading-tight md:text-6xl">
          Beyond Websites.
          <br />
          We Build Digital
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Infrastructure.
          </span>
        </h1>
        <p className="mt-6 max-w-md text-gray-400">
          We help businesses engineer scalable systems, automate operations,
          and accelerate growth through software engineering, digital
          transformation, and intelligent business solutions.
        </p>
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            className="rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-medium text-white"
          >
            Book Strategy Session
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-md border border-gray-600 px-6 py-3 text-sm font-medium text-white"
          >
            View Case Studies
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div className="relative hidden h-[420px] md:block">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(99,102,241,0.25),_transparent_70%)]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-indigo-500/30" />
        {badges.map(({ icon: Icon, label, className }) => (
          <div
            key={label}
            className={`absolute flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm backdrop-blur ${className}`}
          >
            <Icon size={16} />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
