const filters = [
  "All Insights",
  "Engineering",
  "Automation",
  "Business Strategy",
  "Infrastructure",
  "Productivity",
  "Digital Transformation",
];

export default function InsightFilters() {
  return (
    <div className="flex flex-wrap gap-3 px-20 pb-8">
      {filters.map((filter, i) => (
        <button
          key={filter}
          type="button"
          className={`rounded-md border px-4 py-2 text-sm ${
            i === 0
              ? "border-indigo-400/40 bg-indigo-500/20 text-white"
              : "border-white/10 text-gray-300 hover:bg-white/5"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
