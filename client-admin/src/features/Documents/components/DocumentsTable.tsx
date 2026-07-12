import { Search, ChevronDown, Filter, Folder, FileText, Lock, Share2 } from "lucide-react";

const fileTypeColor: Record<string, string> = {
  Folder: "bg-yellow-500/20 text-yellow-300",
  PDF: "bg-red-500/20 text-red-300",
  DOCX: "bg-blue-500/20 text-blue-300",
  XLSX: "bg-green-500/20 text-green-300",
  PNG: "bg-purple-500/20 text-purple-300",
  ZIP: "bg-gray-500/20 text-gray-300",
  PPTX: "bg-orange-500/20 text-orange-300",
};

const documents = [
  { name: "Project Proposals", client: "–", type: "Folder", size: "–", uploadedBy: "Amoo O.", date: "May 20, 2025 · 10:24 AM", access: "Private" },
  { name: "Contracts", client: "–", type: "Folder", size: "–", uploadedBy: "Amoo O.", date: "May 18, 2025 · 02:15 PM", access: "Private" },
  { name: "Website Requirements.pdf", client: "Vektar Luxury", project: "E-Commerce Platform", type: "PDF", size: "2.4 MB", uploadedBy: "Tosin D.", date: "May 20, 2025 · 09:15 AM", access: "Shared" },
  { name: "Project Agreement.docx", client: "Vektar Luxury", project: "E-Commerce Platform", type: "DOCX", size: "1.3 MB", uploadedBy: "Amoo O.", date: "May 15, 2025 · 11:45 AM", access: "Shared" },
  { name: "Project Budget.xlsx", client: "SheaShine Co.", project: "Admin Dashboard", type: "XLSX", size: "856 KB", uploadedBy: "Tosin D.", date: "May 18, 2025 · 03:10 PM", access: "Private" },
  { name: "Maintenance Agreement.pdf", client: "BuildCore Ltd.", project: "Business Portal", type: "PDF", size: "1.1 MB", uploadedBy: "Amoo O.", date: "May 12, 2025 · 10:30 AM", access: "Shared" },
  { name: "Homepage Design.png", client: "Therapy Ltd.", project: "Therapy Platform", type: "PNG", size: "3.2 MB", uploadedBy: "Tosin D.", date: "May 10, 2025 · 01:20 PM", access: "Private" },
  { name: "Service Level Agreement.pdf", client: "GreenLeaf Ltd.", project: "Landing Page", type: "PDF", size: "1.6 MB", uploadedBy: "Amoo O.", date: "May 8, 2025 · 09:05 AM", access: "Shared" },
  { name: "Backup_May_2025.zip", client: "Finex Global", project: "Financial System", type: "ZIP", size: "412 MB", uploadedBy: "System", date: "May 5, 2025 · 12:00 AM", access: "Private" },
  { name: "Project Presentation.pptx", client: "Logix Inc.", project: "Business Portal", type: "PPTX", size: "5.8 MB", uploadedBy: "Tosin D.", date: "Apr 30, 2025 · 04:25 PM", access: "Shared" },
];

export default function DocumentsTable() {
  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-gray-400">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search documents..."
            className="w-full bg-transparent outline-none placeholder:text-gray-500"
          />
        </div>
        {["Folder: All", "File Type: All", "Client: All", "Project: All"].map((label) => (
          <button key={label} type="button" className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-2 text-sm text-gray-300">
            {label}
            <ChevronDown size={14} />
          </button>
        ))}
        <button type="button" className="flex items-center gap-1.5 rounded-md border border-white/10 px-3 py-2 text-sm text-gray-300">
          <Filter size={14} />
          More Filters
        </button>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs text-gray-500">
              <th className="py-2 font-medium">Name</th>
              <th className="py-2 font-medium">Client / Project</th>
              <th className="py-2 font-medium">Type</th>
              <th className="py-2 font-medium">Size</th>
              <th className="py-2 font-medium">Uploaded By</th>
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Access</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(({ name, client, project, type, size, uploadedBy, date, access }) => {
              const isFolder = type === "Folder";
              return (
                <tr key={name} className="border-b border-white/5">
                  <td className="py-3">
                    <div className="flex items-center gap-2 text-gray-200">
                      {isFolder ? (
                        <Folder size={16} className="text-yellow-400" />
                      ) : (
                        <FileText size={16} className="text-gray-400" />
                      )}
                      {name}
                    </div>
                  </td>
                  <td className="py-3 text-gray-400">
                    <p>{client}</p>
                    {project && <p className="text-xs text-gray-500">{project}</p>}
                  </td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs ${fileTypeColor[type]}`}>{type}</span>
                  </td>
                  <td className="py-3 text-gray-400">{size}</td>
                  <td className="py-3 text-gray-400">{uploadedBy}</td>
                  <td className="py-3 text-gray-400">{date}</td>
                  <td className="py-3">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      {access === "Private" ? <Lock size={12} /> : <Share2 size={12} />}
                      {access}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">···</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <span>Showing 1 to 10 of 356 documents</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((page) => (
              <button
                key={page}
                type="button"
                className={`h-8 w-8 rounded-md text-sm ${
                  page === 1 ? "bg-indigo-500 text-white" : "border border-white/10 text-gray-400"
                }`}
              >
                {page}
              </button>
            ))}
            <span className="px-1">...</span>
            <button type="button" className="h-8 w-8 rounded-md border border-white/10 text-gray-400">36</button>
          </div>
        </div>
      </div>
    </div>
  );
}
