import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminArticleForm({
  form,
  onChange,
  onSubmit,
  isSaving,
  successMessage,
  templateFields = [],
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {successMessage ? (
        <div className="rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="article-sector">Sector</Label>
          <select
            id="article-sector"
            value={form.sector}
            onChange={(e) => onChange("sector", e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {["Politics", "Business", "Sports", "Events"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

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
