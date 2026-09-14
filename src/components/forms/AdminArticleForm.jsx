import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ARTICLE_PLACEMENTS } from "@/lib/content-store";
import { getCategoryLabels } from "@/lib/category-store";
import { useStoreVersion } from "@/lib/store-bus";

const MAX_IMAGE_DIMENSION = 1200;

export default function AdminArticleForm({
  form,
  onChange,
  onSubmit,
  isSaving,
  successMessage,
  templateFields = [],
}) {
  useStoreVersion();
  const CATEGORY_OPTIONS = [...getCategoryLabels(), "Editorial", "Opinion", "Analysis"];
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        try {
          const scale = Math.min(
            1,
            MAX_IMAGE_DIMENSION / Math.max(img.width, img.height),
          );
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          onChange("image", canvas.toDataURL("image/jpeg", 0.82));
        } catch {
          onChange("image", typeof reader.result === "string" ? reader.result : "");
        }
      };
      if (typeof reader.result !== "string") return;
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const selectedPlacement = ARTICLE_PLACEMENTS.find(
    (option) => option.value === form.source,
  );

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {successMessage ? (
        <div className="rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="article-status">Publishing state</Label>
          <select
            id="article-status"
            value={form.status}
            onChange={(e) => onChange("status", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {["Draft", "Scheduled", "Published"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-source">Placement</Label>
          <select
            id="article-source"
            value={form.source || "latest"}
            onChange={(e) => onChange("source", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {ARTICLE_PLACEMENTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {selectedPlacement ? (
            <p className="text-xs leading-5 text-stone-500">
              {selectedPlacement.note}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-category">Public category</Label>
          <select
            id="article-category"
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <p className="text-xs leading-5 text-stone-500">
            Controls the badge and category page grouping.
          </p>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="article-headline">Headline</Label>
          <Input
            id="article-headline"
            value={form.headline}
            onChange={(e) => onChange("headline", e.target.value)}
            placeholder="Article headline"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="article-summary">Summary</Label>
          <Textarea
            id="article-summary"
            value={form.summary}
            onChange={(e) => onChange("summary", e.target.value)}
            placeholder="Short summary for list and preview surfaces"
            className="min-h-[110px]"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="article-image">Cover image</Label>
          <div className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
            <div className="flex min-h-[120px] items-center justify-center overflow-hidden rounded-md border border-dashed border-input bg-background">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Cover preview"
                  className="h-full max-h-44 w-full object-cover"
                />
              ) : (
                <span className="p-4 text-center text-xs text-stone-400">
                  No image set
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <input
                  id="article-image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full max-w-[240px] text-xs text-stone-500 file:mr-2 file:rounded-md file:border-0 file:bg-stone-900 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-stone-700"
                />
                {form.image ? (
                  <button
                    type="button"
                    onClick={() => onChange("image", "")}
                    className="rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <Input
                id="article-image"
                value={form.image || ""}
                onChange={(e) => onChange("image", e.target.value)}
                placeholder="Paste an image URL, or upload from your device"
              />
              <p className="text-xs leading-5 text-stone-500">
                Upload from your device or paste a hosted image URL. Uploaded
                images are compressed before saving.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-author">Author</Label>
          <Input
            id="article-author"
            value={form.author}
            onChange={(e) => onChange("author", e.target.value)}
            placeholder="Editorial author or desk"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-read-time">Read time</Label>
          <Input
            id="article-read-time"
            value={form.readTime || ""}
            onChange={(e) => onChange("readTime", e.target.value)}
            placeholder="e.g. 5 min read"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-access-label">Public access label</Label>
          <Input
            id="article-access-label"
            value={form.accessLabel || ""}
            onChange={(e) => onChange("accessLabel", e.target.value)}
            placeholder="e.g. Subscribers now"
          />
          <p className="text-xs leading-5 text-stone-500">
            Badge shown on latest news cards. Leave empty to auto-derive from
            the access window.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-public-date">Public archive date</Label>
          <Input
            id="article-public-date"
            value={form.publicAccessDate}
            onChange={(e) => onChange("publicAccessDate", e.target.value)}
            placeholder="September 10, 2026"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-publish-date">Publish date</Label>
          <Input
            id="article-publish-date"
            value={form.publishDate}
            onChange={(e) => onChange("publishDate", e.target.value)}
            placeholder="August 11, 2026"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="article-publish-time">Publish time</Label>
          <Input
            id="article-publish-time"
            value={form.publishTime}
            onChange={(e) => onChange("publishTime", e.target.value)}
            placeholder="2:00 PM"
          />
        </div>

        {templateFields.map((field) => (
          <div
            key={field.key}
            className={`space-y-2 ${field.fullWidth ? "md:col-span-2" : ""}`.trim()}
          >
            <Label htmlFor={`article-${field.key}`}>{field.label}</Label>
            {field.type === "textarea" ? (
              <Textarea
                id={`article-${field.key}`}
                value={form[field.key] || ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="min-h-[96px]"
              />
            ) : (
              <Input
                id={`article-${field.key}`}
                value={form[field.key] || ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
              />
            )}
            {field.hint ? (
              <p className="text-xs leading-5 text-stone-500">{field.hint}</p>
            ) : null}
          </div>
        ))}

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="article-body">Body draft</Label>
          <Textarea
            id="article-body"
            value={form.body}
            onChange={(e) => onChange("body", e.target.value)}
            placeholder="Long-form body draft"
            className="min-h-[180px]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          disabled={isSaving}
          className="h-11 rounded-2xl bg-stone-900 px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-stone-700"
        >
          {isSaving ? "Saving draft..." : "Save editorial draft"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-2xl px-6 font-sans text-xs font-bold uppercase tracking-[0.22em]"
        >
          Queue publish review
        </Button>
      </div>
    </form>
  );
}