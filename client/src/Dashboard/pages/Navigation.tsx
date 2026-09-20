import { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Plus, Trash2, ExternalLink } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";
import { useDashboardAuth } from "../context/DashboardAuthContext";
import { createNavItem, deleteNavItem, fetchNavItems, reorderNavItems, updateNavItem } from "../hooks/useNavigation";
import { fetchCollections } from "../hooks/useCollections";
import { fetchPages } from "../hooks/usePages";
import type { NavItem, NavLinkType } from "../api/navigation.types";
import type { Collection } from "../api/collections.types";
import type { Page } from "../api/pages.types";

const LINK_TYPE_LABELS: Record<NavLinkType, string> = {
  home: "Home",
  shop: "Shop (all products)",
  collection: "A Collection",
  page: "A Page",
  custom: "Custom URL",
};

const inputClass =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900";

function AddItemForm({
  collections,
  pages,
  onAdded,
}: {
  collections: Collection[];
  pages: Page[];
  onAdded: (item: NavItem) => void;
}) {
  const [label, setLabel] = useState("");
  const [linkType, setLinkType] = useState<NavLinkType>("page");
  const [targetSlug, setTargetSlug] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!label.trim()) return;
    setSubmitting(true);
    try {
      const item = await createNavItem({
        label: label.trim(),
        linkType,
        targetSlug: linkType === "collection" || linkType === "page" ? targetSlug : undefined,
        customUrl: linkType === "custom" ? customUrl : undefined,
      });
      onAdded(item);
      setLabel("");
      setTargetSlug("");
      setCustomUrl("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-lg border border-dashed border-gray-300 p-4">
      <p className="mb-3 text-sm font-medium text-gray-700">Add Menu Item</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Label</label>
          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. About Us" className={inputClass} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Links To</label>
          <select value={linkType} onChange={(e) => setLinkType(e.target.value as NavLinkType)} className={inputClass}>
            {Object.entries(LINK_TYPE_LABELS).map(([id, l]) => (
              <option key={id} value={id}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {linkType === "collection" && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Collection</label>
            <select value={targetSlug} onChange={(e) => setTargetSlug(e.target.value)} className={inputClass}>
              <option value="">Select a collection</option>
              {collections
                .filter((c): c is typeof c & { slug: string } => c.slug !== null)
                .map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        {linkType === "page" && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">Page</label>
            <select value={targetSlug} onChange={(e) => setTargetSlug(e.target.value)} className={inputClass}>
              <option value="">Select a page</option>
              {pages.map((p) => (
                <option key={p.id} value={p.slug}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {linkType === "custom" && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">URL</label>
            <input
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="/contact or https://..."
              className={inputClass}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting || !label.trim()}
        className="mt-3 flex items-center gap-1.5 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black disabled:opacity-50"
      >
        <Plus size={14} />
        {submitting ? "Adding…" : "Add Item"}
      </button>
    </div>
  );
}

export default function Navigation() {
  const { session } = useDashboardAuth();
  const [items, setItems] = useState<NavItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [navResult, collectionsResult, pagesResult] = await Promise.all([
        fetchNavItems("main"),
        fetchCollections({}),
        fetchPages({}),
      ]);
      setItems(navResult);
      setCollections(collectionsResult.items);
      setPages(pagesResult.items);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function move(index: number, direction: -1 | 1) {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setItems(next);
    await reorderNavItems("main", next.map((i) => i.id));
  }

  async function toggleVisible(item: NavItem) {
    const updated = await updateNavItem(item.id, { isVisible: !item.isVisible });
    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
  }

  async function remove(item: NavItem) {
    await deleteNavItem(item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
  }

  function describeTarget(item: NavItem): string {
    if (item.linkType === "home") return "Homepage";
    if (item.linkType === "shop") return "Shop page";
    if (item.linkType === "collection") return collections.find((c) => c.slug === item.targetSlug)?.name ?? item.targetSlug ?? "—";
    if (item.linkType === "page") return pages.find((p) => p.slug === item.targetSlug)?.title ?? item.targetSlug ?? "—";
    return item.customUrl ?? "—";
  }

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Navigation</h1>
          <p className="text-sm text-gray-500">Build your store's main menu.</p>
        </div>
        {session && (
          <a
            href={`/store/${session.business.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ExternalLink size={15} />
            View Store
          </a>
        )}
      </div>

      {loading ? (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-400">Loading…</div>
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-3 text-sm font-semibold text-gray-900">Main Menu</p>

            {items.length === 0 ? (
              <p className="py-6 text-center text-sm text-gray-400">No menu items yet.</p>
            ) : (
              <div className="space-y-1">
                {items.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2 rounded-md border border-gray-100 px-3 py-2.5">
                    <div className="flex flex-col text-gray-300">
                      <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="hover:text-gray-600 disabled:opacity-30">
                        <ChevronUp size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => move(index, 1)}
                        disabled={index === items.length - 1}
                        className="hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronDown size={13} />
                      </button>
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <p className="text-xs text-gray-400">{describeTarget(item)}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleVisible(item)}
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.isVisible ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {item.isVisible ? "Visible" : "Hidden"}
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(item)}
                      className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <AddItemForm
            collections={collections}
            pages={pages}
            onAdded={(item) => setItems((prev) => [...prev, item])}
          />
        </div>
      )}
    </DashboardLayout>
  );
}
