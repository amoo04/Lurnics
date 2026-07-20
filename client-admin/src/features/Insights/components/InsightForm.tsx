import { useRef, useState, type FormEvent } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { createArticle, updateArticle } from "../hooks/useInsights";
import { apiUpload, ApiError } from "../../../lib/api";
import type { Article, ArticleStatus } from "../api/insights.types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface InsightFormProps {
  article: Article | null;
  onSaved: () => void;
  onClose: () => void;
}

export default function InsightForm({ article, onSaved, onClose }: InsightFormProps) {
  const isEditing = !!article;

  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [featuredImage, setFeaturedImage] = useState(article?.featuredImage ?? "");
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "");
  const [status, setStatus] = useState<ArticleStatus>(article?.status ?? "draft");
  const [metaTitle, setMetaTitle] = useState(article?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(article?.metaDescription ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    try {
      const { url } = await apiUpload<{ url: string }>("/api/uploads/image", file);
      setFeaturedImage(url);
    } catch (err) {
      setUploadError(err instanceof ApiError ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const input = {
      title,
      slug,
      featuredImage: featuredImage || undefined,
      excerpt: excerpt || undefined,
      content,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      status,
    };

    try {
      if (isEditing) {
        await updateArticle(article.id, input);
      } else {
        await createArticle(input);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save article");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">{isEditing ? "Edit Article" : "New Article"}</h3>
        <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-900">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">Slug</label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(slugify(e.target.value));
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Featured Image</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          {featuredImage ? (
            <div className="relative">
              <img
                key={featuredImage}
                src={featuredImage}
                alt=""
                className="h-40 w-full rounded-md border border-gray-200 object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-900 shadow-sm hover:bg-white disabled:opacity-60"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Replace
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-32 w-full flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-gray-300 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-60"
            >
              {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              {uploading ? "Uploading…" : "Click to upload an image"}
            </button>
          )}

          {uploadError && <p className="mt-1.5 text-xs text-red-500">{uploadError}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Excerpt</label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Short summary shown in article listings"
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-gray-900"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Content</label>
          <textarea
            required
            rows={10}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">Meta Title (SEO)</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-gray-600">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ArticleStatus)}
              className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-gray-600">Meta Description (SEO)</label>
          <textarea
            rows={2}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-900"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black disabled:opacity-60"
          >
            {submitting ? "Saving…" : isEditing ? "Save Changes" : "Create Article"}
          </button>
        </div>
      </form>
    </div>
  );
}
