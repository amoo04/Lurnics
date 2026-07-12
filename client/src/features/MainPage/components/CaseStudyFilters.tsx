import type { Industry } from "../api/main.types";

interface CaseStudyFiltersProps {
  industries: Industry[];
  activeIndustryId: string | undefined;
  onSelect: (industryId: string | undefined) => void;
}

export default function CaseStudyFilters({
  industries,
  activeIndustryId,
  onSelect,
}: CaseStudyFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 px-4 sm:px-8 md:px-20 pb-8">
      <button
        type="button"
        onClick={() => onSelect(undefined)}
        className={`rounded-md border px-4 py-2 text-sm ${
          activeIndustryId === undefined
            ? "border-indigo-400/40 bg-indigo-500/20 text-white"
            : "border-white/10 text-gray-300 hover:bg-white/5"
        }`}
      >
        All Case Studies
      </button>
      {industries.map((industry) => (
        <button
          key={industry.id}
          type="button"
          onClick={() => onSelect(industry.id)}
          className={`rounded-md border px-4 py-2 text-sm ${
            activeIndustryId === industry.id
              ? "border-indigo-400/40 bg-indigo-500/20 text-white"
              : "border-white/10 text-gray-300 hover:bg-white/5"
          }`}
        >
          {industry.name}
        </button>
      ))}
    </div>
  );
}
