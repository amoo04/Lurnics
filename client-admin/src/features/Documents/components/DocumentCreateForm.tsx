import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { createDocument } from "../hooks/useDocuments";
import { ApiError } from "../../../lib/api";

export default function DocumentCreateForm({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const [documentName, setDocumentName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [clientId, setClientId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createDocument({
        documentName,
        fileUrl,
        fileType,
        clientId: clientId || undefined,
        projectId: projectId || undefined,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to add document");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full lg:w-80 lg:shrink-0">
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-gray-900">Add Document</p>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-900">
            <X size={16} />
          </button>
        </div>

        <input
          required
          placeholder="Document name"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
        />
        <input
          required
          placeholder="File URL"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
        />
        <input
          required
          placeholder="File type (e.g. pdf, docx)"
          value={fileType}
          onChange={(e) => setFileType(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
        />
        <input
          placeholder="Client ID (optional)"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
        />
        <input
          placeholder="Project ID (optional)"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
        >
          {submitting ? "Adding…" : "Add Document"}
        </button>
      </form>
    </div>
  );
}
