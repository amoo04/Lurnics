import { useRef } from "react";
import {
  Heart,
  GraduationCap,
  ShoppingBag,
  Truck,
  Landmark,
  Briefcase,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const industries = [
  { icon: Heart, label: "Healthcare" },
  { icon: GraduationCap, label: "Education" },
  { icon: ShoppingBag, label: "Retail" },
  { icon: Truck, label: "Logistics" },
  { icon: Landmark, label: "Finance" },
  { icon: Briefcase, label: "Professional Services" },
];

export default function Industries() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollByAmount(amount: number) {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section className="px-4 sm:px-8 md:px-20 py-10">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-indigo-400">
        Industries We Transform
      </p>

      <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-5">
        <button
          type="button"
          onClick={() => scrollByAmount(-200)}
          aria-label="Scroll industries left"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10"
        >
          <ArrowLeft size={16} />
        </button>

        <div ref={scrollRef} className="flex flex-1 items-center justify-between gap-6 overflow-x-auto">
          {industries.map(({ icon: Icon, label }) => (
            <div key={label} className="flex shrink-0 items-center gap-2 text-sm text-gray-300">
              <Icon size={18} className="text-indigo-300" />
              {label}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollByAmount(200)}
          aria-label="Scroll industries right"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10"
        >
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}
