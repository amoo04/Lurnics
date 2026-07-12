import { FileText, Upload } from "lucide-react";

const uploads = [
  { name: "Client Brief.pdf", client: "Vektar Luxury", date: "May 20, 2025", size: "2.1 MB" },
  { name: "Wireframe_v2.png", client: "Therapy Ltd.", date: "May 20, 2025", size: "4.3 MB" },
  { name: "Database Schema.sql", client: "Finex Global", date: "May 19, 2025", size: "1.7 MB" },
  { name: "Content List.xlsx", client: "SheaShine Co.", date: "May 19, 2025", size: "987 KB" },
  { name: "Meeting Notes.docx", client: "BuildCore Ltd.", date: "May 19, 2025", size: "1.2 MB" },
];

export default function RecentUploadsPanel() {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">Recent Uploads</h3>
        <button type="button" className="text-xs text-indigo-400">View All</button>
      </div>

      <ul className="space-y-3">
        {uploads.map(({ name, client, date, size }) => (
          <li key={name} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-300">
              <FileText size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-gray-200">{name}</p>
              <p className="text-xs text-gray-500">{client}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>{date}</p>
              <p>{size}</p>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-gray-300"
      >
        <Upload size={14} />
        Upload New Document
      </button>
    </div>
  );
}
