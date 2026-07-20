import { User, Link2 } from "lucide-react";

const team = [
  { name: "Amoo Oluwasegun", role: "Founder & Lead Engineer", filled: true },
  { name: "New Talent", role: "Coming Soon", filled: false },
  { name: "New Talent", role: "Coming Soon", filled: false },
  { name: "New Talent", role: "Coming Soon", filled: false },
];

export default function TeamGrid() {
  return (
    <section className="px-4 sm:px-8 md:px-20 py-16">
      <div className="mb-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
          Our Team
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-gray-900">
          The team behind the mission.
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {team.map(({ name, role, filled }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p
                className={
                  filled ? "flex items-center gap-1 text-xs text-orange-500" : "text-xs text-orange-500"
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
