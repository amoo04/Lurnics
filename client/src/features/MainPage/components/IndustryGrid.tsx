import { useIndustries } from "../hooks/useContent";
import { ICONS_BY_SLUG, DEFAULT_INDUSTRY_ICON } from "../lib/industryIcons";

export default function IndustryGrid() {
  const { data, loading, error } = useIndustries();
  const industries = data?.items ?? [];

  return (
    <section className="px-4 sm:px-8 md:px-20 py-16">
      <div className="mb-12 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-orange-500">
          Industries We Transform
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-gray-900">
          Built for your industry. Designed for impact.
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600">
          We understand the unique needs of your industry and build digital
          infrastructure that helps you streamline operations, reduce costs,
          and scale with confidence.
        </p>
      </div>

      {loading && (
        <p className="text-center text-sm text-gray-500">Loading industries…</p>
      )}

      {error && <p className="text-center text-sm text-red-500">{error}</p>}

      {!loading && !error && industries.length === 0 && (
        <p className="text-center text-sm text-gray-500">No industries published yet.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
        {industries.map(({ id, slug, name, description }) => {
          const { icon: Icon, iconBg } = ICONS_BY_SLUG[slug] ?? DEFAULT_INDUSTRY_ICON;
          return (
            <div
              key={id}
              className="flex flex-col justify-between overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div>
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-900">{name}</h3>
                {description && <p className="mt-2 text-xs text-gray-600">{description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
