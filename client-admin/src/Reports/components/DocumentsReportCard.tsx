import { useDocumentsReport } from "../hooks/useReports";

export default function DocumentsReportCard() {
  const { data, loading, error } = useDocumentsReport();

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-gray-900">Documents</h3>

      {loading && <p className="text-sm text-gray-500">Loading…</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {data && (
        <>
          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.total}</p>
              <p className="text-xs text-gray-500">Total documents</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{data.recentCount}</p>
              <p className="text-xs text-gray-500">Uploaded in last 7 days</p>
            </div>
          </div>

          {data.byType.length > 0 && (
            <div className="mb-5">
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">By Type</p>
              <ul className="space-y-1.5 text-sm">
                {data.byType.map((row) => (
                  <li key={row.fileType} className="flex items-center justify-between">
                    <span className="uppercase text-gray-700">{row.fileType}</span>
                    <span className="text-gray-500">{row.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.byClient.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Top Clients</p>
              <ul className="space-y-1.5 text-sm">
                {data.byClient.map((row) => (
                  <li key={row.clientId} className="flex items-center justify-between">
                    <span className="text-gray-700">{row.companyName}</span>
                    <span className="text-gray-500">{row.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.total === 0 && <p className="text-sm text-gray-500">No documents yet.</p>}
        </>
      )}
    </div>
  );
}
