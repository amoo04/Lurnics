import { User, Link2 } from "lucide-react";

const team = [
  { name: "Amoo Oluwasegun", role: "Founder & Lead Engineer", filled: true },
  { name: "New Talent", role: "Coming Soon", filled: false },
  { name: "New Talent", role: "Coming Soon", filled: false },
  { name: "New Talent", role: "Coming Soon", filled: false },
];

export default function TeamGrid() {
  return (
    <section className="px-20 py-16">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
          Our Team
        </p>
        <h2 className="mt-2 text-3xl font-semibold">
          The team behind the mission.
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {team.map(({ name, role, filled }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-gray-500">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-medium">{name}</p>
              <p
                className={
                  filled ? "flex items-center gap-1 text-xs text-purple-400" : "text-xs text-purple-400"
                }
              >
                {filled ? (
                  <>
                    {role}
                    <Link2 size={12} />
                  </>
                ) : (
                  role
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
