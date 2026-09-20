import { Target, Eye } from "lucide-react";

export default function MissionVision() {
  return (
    <section id="mission" className="grid gap-6 px-4 sm:px-8 md:px-20 py-10 md:grid-cols-2">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
          <Target size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Our Mission</h3>
        <p className="mt-3 text-sm text-gray-600">
          To help businesses automate operations, optimize processes, and
          build scalable digital infrastructure that drives growth and
          lasting impact.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
          <Eye size={20} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Our Vision</h3>
        <p className="mt-3 text-sm text-gray-600">
          To become a global technology partner for forward-thinking
          organizations, building innovative solutions that empower
          businesses and shape the future.
        </p>
      </div>
    </section>
  );
}
