import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { createProject } from "../hooks/useProjects";
import { PROJECT_STATUSES } from "../api/projects.types";
import { useApiGet } from "../../../lib/useApi";
import { ApiError } from "../../../lib/api";

interface ClientOption {
  id: string;
  companyName: string;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProjectCreateForm({ onCreated, onClose }: { onCreated: () => void; onClose: () => void }) {
  const { data: clientsData } = useApiGet<{ items: ClientOption[] }>("/api/clients?limit=100");
  const [clientId, setClientId] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("");
  const [status, setStatus] = useState<string>(PROJECT_STATUSES[0]);
  const [budget, setBudget] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await createProject({
        clientId,
        projectName,
        slug: `${slugify(projectName)}-${Date.now().toString(36)}`,
        projectType,
        status,
        budget: budget ? Number(budget) : undefined,
        dueDate: dueDate || undefined,
      });
      onCreated();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full lg:w-80 lg:shrink-0 px-4 sm:px-0">
      <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 bg-white/[0.03] p-5 space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Add Project</p>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <select
          required
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-gray-300 outline-none"
        >
          <option value="">Select client…</option>
          {(clientsData?.items ?? []).map((c) => (
            <option key={c.id} value={c.id} className="bg-[#0b0f1a]">
              {c.companyName}
            </option>
          ))}
        </select>
        <input
          required
          placeholder="Project name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
        />
        <input
          required
          placeholder="Project type (e.g. Web App)"
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-[#0b0f1a] px-3 py-2 text-sm text-gray-300 outline-none"
        >
          {PROJECT_STATUSES.map((s) => (
            <option key={s} value={s} className="bg-[#0b0f1a] capitalize">
              {s}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Budget (optional)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm outline-none placeholder:text-gray-500"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-gray-300 outline-none"
        />

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Creating…" : "Create Project"}
        </button>
      </form>
    </div>
  );
}
