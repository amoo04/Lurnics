const labels = [
  "Strategy & Consulting",
  "Software Engineering",
  "Digital Infrastructure",
  "Business Automation",
  "Growth & Marketing",
];

export default function ServicesHero() {
  return (
    <section className="grid items-center gap-12 px-20 py-16 md:grid-cols-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Services
        </p>
        <h1 className="mt-3 text-5xl font-bold leading-tight">
          Digital infrastructure that powers real business growth.
        </h1>
        <p className="mt-6 max-w-md text-gray-400">
          We design, build, and manage scalable systems that help
          organizations automate operations, improve efficiency, and unlock
          new opportunities.
        </p>
      </div>

      <div className="relative flex h-[320px] items-center justify-center">
        <div className="relative">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                transform: `translate(${i * 14}px, ${-i * 22}px) skew(-12deg, 6deg)`,
                opacity: 0.9 - i * 0.15,
              }}
              className="absolute h-28 w-44 rounded-md border border-indigo-400/40 bg-gradient-to-br from-indigo-500/40 to-blue-500/20 shadow-[0_0_40px_rgba(99,102,241,0.35)]"
            />
          ))}
        </div>

        <ul className="absolute right-0 top-1/2 w-56 -translate-y-1/2 space-y-6 text-sm text-gray-300">
          {labels.map((label) => (
            <li key={label} className="flex items-center gap-3">
              <span className="h-px w-8 bg-indigo-400/50" />
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
