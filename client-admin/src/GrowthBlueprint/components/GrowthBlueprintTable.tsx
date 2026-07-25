import type { GrowthBlueprintSubmission } from "../api/growth-blueprint.types";

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-amber-50 text-amber-600",
  generated: "bg-blue-50 text-blue-600",
  sent: "bg-green-50 text-green-600",
};

interface GrowthBlueprintTableProps {
  submissions: GrowthBlueprintSubmission[];
  loading: boolean;
  error: string | null;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function GrowthBlueprintTable({
  submissions,
  loading,
  error,
  selectedId,
  onSelect,
}: GrowthBlueprintTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {loading && <p className="px-4 py-6 text-center text-sm text-gray-500">Loading…</p>}
      {error && <p className="px-4 py-6 text-center text-sm text-red-500">{error}</p>}
      {!loading && !error && submissions.length === 0 && (
        <p className="px-4 py-6 text-center text-sm text-gray-500">
          No growth blueprint submissions yet.
        </p>
      )}

      {!loading && !error && submissions.length > 0 && (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">Business</th>
              <th className="px-4 py-3 font-medium">Industry</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-gray-50 ${
                  selectedId === s.id ? "bg-orange-50" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{s.companyName}</p>
                  <p className="text-xs text-gray-500">{s.contactName} · {s.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-500">{s.industry}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${STATUS_STYLE[s.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(s.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
