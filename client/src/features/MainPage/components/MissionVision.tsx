import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  return (
    <section className="grid gap-6 px-20 py-10 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
          <Target size={20} />
        </div>
        <h3 className="text-lg font-semibold">Our Mission</h3>
        <p className="mt-3 text-sm text-gray-400">
          To help businesses automate operations, optimize processes, and
          build scalable digital infrastructure that drives growth and
          lasting impact.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-8">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
          <Eye size={20} />
        </div>
        <h3 className="text-lg font-semibold">Our Vision</h3>
        <p className="mt-3 text-sm text-gray-400">
          To become a global technology partner for forward-thinking
          organizations, building innovative solutions that empower
          businesses and shape the future.
        </p>
      </div>
    </section>
  );
}
