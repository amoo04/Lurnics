import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronDown as ChevronExpand,
  Layout,
  Megaphone,
  Image as ImageIcon,
  Grid3x3,
  Package,
  MessageSquare,
  Mail,
  PanelBottom,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import { fetchSections, reorderSections, updateSection } from "../hooks/useStoreSections";
import type { SectionType, StoreSection } from "../api/store-sections.types";

const SECTION_META: Record<SectionType, { label: string; description: string; icon: typeof Layout }> = {
  header: { label: "Header", description: "Logo, navigation", icon: Layout },
  announcement: { label: "Announcement Bar", description: "Promotions, offers, messages", icon: Megaphone },
  hero: { label: "Hero Banner", description: "Big image, text, button", icon: ImageIcon },
  featured_collections: { label: "Featured Collections", description: "Showcase your collections", icon: Grid3x3 },
  featured_products: { label: "Featured Products", description: "Display your best products", icon: Package },
  testimonials: { label: "Testimonials", description: "Customer reviews", icon: MessageSquare },
  newsletter: { label: "Newsletter", description: "Email subscription", icon: Mail },
  footer: { label: "Footer", description: "Links, policies, social icons", icon: PanelBottom },
};

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

function updateField(content: Record<string, unknown>, key: string, value: unknown) {
  return { ...content, [key]: value };
}

function SectionFields({
  section,
  content,
  onChange,
}: {
  section: StoreSection;
  content: Record<string, unknown>;
  onChange: (content: Record<string, unknown>) => void;
}) {
  switch (section.type) {
    case "header":
      return <p className="text-sm text-gray-500">Automatic — shows your business name and navigation links.</p>;

    case "announcement":
      return (
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Message</label>
          <input
            value={(content.message as string) ?? ""}
            onChange={(e) => onChange(updateField(content, "message", e.target.value))}
            className={inputClass}
          />
        </div>
      );

    case "hero":
      return (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Eyebrow (Optional)</label>
            <input
              value={(content.eyebrow as string) ?? ""}
              onChange={(e) => onChange(updateField(content, "eyebrow", e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Headline</label>
            <input
              value={(content.headline as string) ?? ""}
              onChange={(e) => onChange(updateField(content, "headline", e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Subtext (Optional)</label>
            <input
              value={(content.subtext as string) ?? ""}
              onChange={(e) => onChange(updateField(content, "subtext", e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Button Text</label>
              <input
                value={(content.buttonText as string) ?? ""}
                onChange={(e) => onChange(updateField(content, "buttonText", e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Button Link</label>
              <input
                value={(content.buttonLink as string) ?? ""}
                onChange={(e) => onChange(updateField(content, "buttonLink", e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      );

    case "featured_collections":
    case "featured_products":
      return (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Heading</label>
            <input
              value={(content.heading as string) ?? ""}
              onChange={(e) => onChange(updateField(content, "heading", e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Max Items to Show</label>
            <input
              type="number"
              min={1}
              max={12}
              value={(content.limit as number) ?? 8}
              onChange={(e) => onChange(updateField(content, "limit", Number(e.target.value) || 1))}
              className={inputClass}
            />
          </div>
          <p className="col-span-2 text-xs text-gray-400">
            Automatically shows your {section.type === "featured_collections" ? "active collections" : "active, in-stock products"} — newest first.
          </p>
        </div>
      );

    case "testimonials": {
      const items = (content.items as Array<{ name: string; quote: string }>) ?? [];
      return (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Heading</label>
            <input
              value={(content.heading as string) ?? ""}
              onChange={(e) => onChange(updateField(content, "heading", e.target.value))}
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-2 rounded-md border border-gray-200 p-2">
                <div className="flex-1 space-y-1.5">
                  <input
                    value={item.name}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...next[i], name: e.target.value };
                      onChange(updateField(content, "items", next));
                    }}
                    placeholder="Customer name"
                    className={inputClass}
                  />
                  <textarea
                    value={item.quote}
                    onChange={(e) => {
                      const next = [...items];
                      next[i] = { ...next[i], quote: e.target.value };
                      onChange(updateField(content, "items", next));
                    }}
                    placeholder="Quote"
                    rows={2}
                    className={inputClass}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onChange(updateField(content, "items", items.filter((_, idx) => idx !== i)))}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange(updateField(content, "items", [...items, { name: "", quote: "" }]))}
              className="flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700"
            >
              <Plus size={13} />
              Add Testimonial
            </button>
          </div>
        </div>
      );
    }

    case "newsletter":
      return (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Heading</label>
            <input
              value={(content.heading as string) ?? ""}
              onChange={(e) => onChange(updateField(content, "heading", e.target.value))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Subtext</label>
            <input
              value={(content.subtext as string) ?? ""}
              onChange={(e) => onChange(updateField(content, "subtext", e.target.value))}
              className={inputClass}
            />
          </div>
          <p className="text-xs text-gray-400">
            Visitors who subscribe are added to your Customers list, tagged "newsletter".
          </p>
        </div>
      );

    case "footer": {
      const links = (content.links as Array<{ label: string; url: string }>) ?? [];
      return (
        <div className="space-y-3">
          <div className="space-y-2">
            {links.map((link, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={link.label}
                  onChange={(e) => {
                    const next = [...links];
                    next[i] = { ...next[i], label: e.target.value };
                    onChange(updateField(content, "links", next));
                  }}
                  placeholder="Label"
                  className={inputClass}
                />
                <input
                  value={link.url}
                  onChange={(e) => {
                    const next = [...links];
                    next[i] = { ...next[i], url: e.target.value };
                    onChange(updateField(content, "links", next));
                  }}
                  placeholder="/url"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => onChange(updateField(content, "links", links.filter((_, idx) => idx !== i)))}
                  className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => onChange(updateField(content, "links", [...links, { label: "", url: "" }]))}
              className="flex items-center gap-1.5 text-xs font-medium text-orange-600 hover:text-orange-700"
            >
              <Plus size={13} />
              Add Link
            </button>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

export default function StoreBuilder() {
  const { session } = useDashboardAuth();
  const [sections, setSections] = useState<StoreSection[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, Record<string, unknown>>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [previewKey, setPreviewKey] = useState(0);

  async function load() {
    setLoading(true);
    try {
      const result = await fetchSections();
      setSections(result);
      setDrafts(Object.fromEntries(result.map((s) => [s.id, s.content])));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleVisible(section: StoreSection) {
    const updated = await updateSection(section.id, { visible: !section.visible });
    setSections((prev) => prev.map((s) => (s.id === section.id ? updated : s)));
    setPreviewKey((k) => k + 1);
  }

  async function move(index: number, direction: -1 | 1) {
    const next = [...sections];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
    await reorderSections(next.map((s) => s.id));
    setPreviewKey((k) => k + 1);
  }

  async function saveSection(section: StoreSection) {
    setSavingId(section.id);
    try {
      const updated = await updateSection(section.id, { content: drafts[section.id] });
      setSections((prev) => prev.map((s) => (s.id === section.id ? updated : s)));
      setPreviewKey((k) => k + 1);
    } finally {
      setSavingId(null);
    }
  }

  const storeUrl = session ? `/store/${session.business.slug}` : "";

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Store Builder</h1>
          <p className="text-sm text-gray-500">Design and customize your online store.</p>
        </div>
        {session && (
          <a
            href={storeUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink size={15} />
            View Store
          </a>
        )}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="mb-3 text-sm font-semibold text-gray-900">Customize your store</p>

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
          ) : (
            <div className="space-y-2">
              {sections.map((section, index) => {
                const meta = SECTION_META[section.type];
                const Icon = meta.icon;
                const isExpanded = expanded === section.id;

                return (
                  <div key={section.id} className="rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 px-3 py-2.5">
                      <div className="flex flex-col text-gray-300">
                        <button
                          type="button"
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                          className="hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronUp size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => move(index, 1)}
                          disabled={index === sections.length - 1}
                          className="hover:text-gray-600 disabled:opacity-30"
                        >
                          <ChevronDown size={13} />
                        </button>
                      </div>

                      <Icon size={16} className="shrink-0 text-gray-400" />

                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : section.id)}
                        className="flex flex-1 items-center justify-between text-left"
                      >
                        <span>
                          <span className="block text-sm font-medium text-gray-900">{meta.label}</span>
                          <span className="block text-xs text-gray-400">{meta.description}</span>
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleVisible(section)}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          section.visible ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {section.visible ? "Visible" : "Hidden"}
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpanded(isExpanded ? null : section.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ChevronExpand size={15} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-gray-100 p-3">
                        <SectionFields
                          section={section}
                          content={drafts[section.id] ?? {}}
                          onChange={(content) => setDrafts((prev) => ({ ...prev, [section.id]: content }))}
                        />
                        {section.type !== "header" && (
                          <button
                            type="button"
                            onClick={() => saveSection(section)}
                            disabled={savingId === section.id}
                            className="mt-3 rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-60"
                          >
                            {savingId === section.id ? "Saving…" : "Save Section"}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <p className="mb-2 text-sm font-semibold text-gray-900">Live preview of your store</p>
          {session ? (
            <iframe
              key={previewKey}
              title="Store preview"
              src={storeUrl}
              className="h-[720px] w-full rounded-lg border border-gray-200"
            />
          ) : (
            <div className="p-10 text-center text-sm text-gray-400">Loading…</div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
