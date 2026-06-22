import { Link2, AtSign, Code2, Cloud, Cog, TrendingUp, Layers, Smartphone } from "lucide-react";

const expertise = [
  { icon: Code2, label: "Software Engineering" },
  { icon: Cloud, label: "Cloud Infrastructure" },
  { icon: Cog, label: "Business Automation" },
  { icon: TrendingUp, label: "Digital Transformation" },
  { icon: Layers, label: "System Architecture" },
  { icon: Smartphone, label: "Product Development" },
];

export default function FounderProfile() {
  return (
    <section className="px-20 py-10">
      <div className="grid gap-8 rounded-xl border border-white/10 bg-white/[0.03] p-8 md:grid-cols-[200px_1fr_240px]">
        <div className="flex h-56 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-xs text-gray-500">
          Photo placeholder
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Founder
          </p>
          <h3 className="mt-1 text-2xl font-semibold">Amoo Oluwasegun</h3>
          <p className="text-sm text-purple-400">Founder &amp; Lead Engineer</p>

          <div className="mt-4 space-y-3 text-sm text-gray-400">
            <p>
              I started Lurnics with a simple belief — businesses don't just
              need websites; they need systems that work, scale, and create
              real value.
            </p>
            <p>
              With a strong background in software engineering and a passion
              for solving real problems, I help organizations transform the
              way they operate through technology and automation.
            </p>
            <p>
              Lurnics is built on clarity, engineering excellence, and a
              commitment to helping businesses build infrastructure for the
              future.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            {[Link2, Code2, AtSign].map((Icon, i) => (
              <div
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-gray-300"
              >
                <Icon size={14} />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-purple-400">
            Areas of Expertise
          </p>
          <ul className="mt-3 space-y-3 text-sm text-gray-300">
            {expertise.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-300">
                  <Icon size={14} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
