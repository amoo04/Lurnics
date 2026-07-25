interface CheckboxGridProps {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  columns?: 2 | 3;
}

export default function CheckboxGrid({ options, selected, onToggle, columns = 2 }: CheckboxGridProps) {
  return (
    <div className={`grid gap-3 ${columns === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
      {options.map((option) => {
        const checked = selected.includes(option);
        return (
          <label
            key={option}
            className={`flex cursor-pointer items-center gap-2.5 rounded-md border px-4 py-2.5 text-sm transition ${
              checked
                ? "border-orange-500 bg-orange-50 text-gray-900"
                : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
            }`}
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(option)}
              className="h-4 w-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            {option}
          </label>
        );
      })}
    </div>
  );
}
