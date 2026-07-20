import { useLeadsByService } from "../hooks/useAnalytics";

export default function TopServicesTable() {
  const { data, loading, error } = useLeadsByService();

  return (
    <div className="flex-1 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Top Performing Services</h3>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      {!loading && !error && (!data || data.length === 0) && (
        <p className="text-sm text-gray-500">
          No service data yet — leads submitted through the contact form with a selected service will appear here.
        </p>
      )}

      {data && data.length > 0 && (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="pb-3 font-normal">Service</th>
              <th className="pb-3 font-normal">Leads</th>
              <th className="pb-3 font-normal">Won</th>
              <th className="pb-3 font-normal">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.service} className="border-t border-gray-200 hover:bg-gray-50">
                <td className="py-3 text-gray-900">{r.service}</td>
                <td className="py-3 text-gray-500">{r.count.toLocaleString()}</td>
                <td className="py-3 text-gray-500">{r.wonCount.toLocaleString()}</td>
                <td className="py-3 text-emerald-600">{r.conversionRate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
