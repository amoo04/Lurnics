const rows = [
  { service: "Cloud Infrastructure Setup", views: 3240, leads: 38, conversion: "8.1%" },
  { service: "Custom Software Development", views: 2870, leads: 32, conversion: "7.4%" },
  { service: "E-commerce Platforms", views: 2410, leads: 27, conversion: "6.9%" },
  { service: "IT Consulting & Strategy", views: 1980, leads: 21, conversion: "6.2%" },
  { service: "Cybersecurity Audits", views: 1540, leads: 14, conversion: "5.1%" },
];

export default function TopServicesTable() {
  return (
    <div className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="mb-4 font-semibold">Top Performing Services</h3>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="pb-3 font-normal">Service</th>
            <th className="pb-3 font-normal">Views</th>
            <th className="pb-3 font-normal">Leads</th>
            <th className="pb-3 font-normal">Conversion</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.service} className="border-t border-white/5">
              <td className="py-3 text-gray-200">{r.service}</td>
              <td className="py-3 text-gray-400">{r.views.toLocaleString()}</td>
              <td className="py-3 text-gray-400">{r.leads}</td>
              <td className="py-3 text-emerald-400">{r.conversion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
