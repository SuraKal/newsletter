import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ExternalLink, RefreshCw, Save } from "lucide-react";
import {
  DashboardPageHeader,
  DashboardPanel,
} from "@/components/dashboard/DashboardPrimitives";
import { appClient } from "@/api/appClient";
import { LEGAL_PAGE_KEYS } from "@/lib/legal-store";

const PAGE_PATHS = {
  terms: "/terms",
  privacy: "/privacy",
  refund: "/refund",
  cookies: "/cookies",
};

const PAGE_LABELS = {
  terms: "Terms of Service",
  privacy: "Privacy Policy",
  refund: "Refund Policy",
  cookies: "Cookies Policy",
};

const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 font-sans text-sm text-stone-800 outline-none transition-colors focus:border-[#4A2A08] focus:ring-2 focus:ring-[#4A2A08]/20";
const labelClass =
  "font-sans text-[0.65rem] font-bold uppercase tracking-[0.18em] text-stone-500";

const buildDraft = (page) => ({
  eyebrow: page?.eyebrow || "",
  title: page?.title || "",
  intro: page?.intro || "",
  lastUpdated: page?.lastUpdated || "",
  published: page?.published !== false,
  sections: (page?.sections || []).map((s) => ({ heading: s.heading || "", body: s.body || "" })),
  clauses: (page?.clauses || []).map((c) => ({
    heading: c.heading || "",
    items: Array.isArray(c.items) ? [...c.items] : [],
  })),
  contacts: (page?.contacts || []).map((c) => ({ label: c.label || "", email: c.email || "" })),
});

export default function AdminLegalContent() {
  const [pages, setPages] = useState([]);
  const [activeKey, setActiveKey] = useState(LEGAL_PAGE_KEYS[0]);
  const [form, setForm] = useState(() => buildDraft(null));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");

  const activePage = useMemo(
    () => pages.find((page) => page.key === activeKey) || null,
    [pages, activeKey],
  );

  useEffect(() => {
    let cancelled = false;

    appClient.admin.legal
      .list()
      .then((loaded) => {
        if (cancelled) {
          return;
        }
        setPages(loaded);
        setActiveKey((current) => {
          const firstKey = loaded[0]?.key || LEGAL_PAGE_KEYS[0];
          return current || firstKey;
        });
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const selectPage = (key) => {
    setActiveKey(key);
    setError("");
    setSaveSuccess("");
  };

  useEffect(() => {
    setForm(buildDraft(activePage));
  }, [activePage]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const addRow = (field) => {
    setForm((current) => {
      const list = [...(current[field] || [])];
      if (field === "clauses") {
        list.push({ heading: "", items: [] });
      } else if (field === "contacts") {
        list.push({ label: "", email: "" });
      } else {
        list.push({ heading: "", body: "" });
      }
      return { ...current, [field]: list };
    });
  };

  const updateRow = (field, index, patch) => {
    setForm((current) => {
      const list = [...(current[field] || [])];
      list[index] = { ...list[index], ...patch };
      return { ...current, [field]: list };
    });
  };

  const removeRow = (field, index) => {
    setForm((current) => ({
      ...current,
      [field]: (current[field] || []).filter((_, i) => i !== index),
    }));
  };

  const cleanPayload = () => {
    const sections = (form.sections || [])
      .map((s) => ({ heading: s.heading.trim(), body: s.body.trim() }))
      .filter((s) => s.heading && s.body);
    const clauses = (form.clauses || [])
      .map((c) => ({
        heading: c.heading.trim(),
        items: (c.items || [])
          .map((item) => String(item).trim())
          .filter(Boolean),
      }))
      .filter((c) => c.heading && c.items.length);
    const contacts = (form.contacts || [])
      .map((c) => ({ label: c.label.trim(), email: c.email.trim() }))
      .filter((c) => c.label && c.email);
    return {
      eyebrow: form.eyebrow.trim(),
      title: form.title.trim(),
      intro: form.intro.trim(),
      lastUpdated: form.lastUpdated.trim(),
      published: form.published,
      sections,
      clauses,
      contacts,
    };
  };

  const handleSave = async () => {
    setError("");
    setSaveSuccess("");
    const payload = cleanPayload();
    if (!payload.title) {
      setError("A page title is required.");
      return;
    }
    setIsSaving(true);
    try {
      const updated = await appClient.admin.legal.update(activeKey, payload);
      setPages((current) =>
        current.map((page) => (page.key === activeKey ? updated : page)),
      );
      setSaveSuccess(`Published content for ${PAGE_LABELS[activeKey] || activeKey}.`);
    } catch (saveError) {
      setError(saveError?.message || "The legal page could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    setError("");
    setSaveSuccess("");
    setIsResetting(true);
    try {
      const restored = await appClient.admin.legal.reset(activeKey);
      setPages((current) =>
        current.map((page) => (page.key === activeKey ? restored : page)),
      );
      setSaveSuccess(`Restored the default ${PAGE_LABELS[activeKey] || activeKey} content.`);
    } catch (resetError) {
      setError(resetError?.message || "The legal page could not be reset.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin legal content"
        title="Legal policy pages"
        description="Edit the Terms, Privacy, Refund, and Cookies pages shown in the public site footer. Changes are published to the live page immediately."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Legal content" },
        ]}
        action={
          <Link
            to={PAGE_PATHS[activeKey] || "/terms"}
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            View live page
            <ExternalLink className="h-4 w-4" />
          </Link>
        }
      />

      {isLoading ? (
        <DashboardPanel title="Loading legal pages">
          <p className="font-sans text-sm text-stone-500">
            Loading saved policy content…
          </p>
        </DashboardPanel>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <DashboardPanel title="Pages" className="h-max lg:sticky lg:top-6">
            <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col">
              {LEGAL_PAGE_KEYS.map((key) => {
                const pageMeta = pages.find((page) => page.key === key);
                const isActive = key === activeKey;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => selectPage(key)}
                    className={`shrink-0 rounded-xl px-3.5 py-2.5 text-left font-sans text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-[#4A2A08] text-paper"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {PAGE_LABELS[key] || key}
                    <span
                      className={`ml-1.5 font-sans text-[0.6rem] uppercase tracking-widest ${
                        isActive
                          ? "text-paper/60"
                          : pageMeta?.published
                            ? "text-emerald-600"
                            : "text-stone-400"
                      }`}
                    >
                      {pageMeta?.published === false ? "hidden" : "live"}
                    </span>
                  </button>
                );
              })}
            </nav>
          </DashboardPanel>

          <div className="space-y-6">
            {error ? (
              <DashboardPanel
                title="Save error"
                description={error}
                className="border-l-4 border-l-red-500"
              >
                <span className="sr-only">{error}</span>
              </DashboardPanel>
            ) : null}
            {saveSuccess ? (
              <DashboardPanel
                title="Saved"
                description={saveSuccess}
                className="border-l-4 border-l-emerald-500"
              >
                <span className="sr-only">{saveSuccess}</span>
              </DashboardPanel>
            ) : null}

            <DashboardPanel
              title="Header"
              description="The eyebrow, title, intro, and last-updated line at the top of the page."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-1">
                  <span className={labelClass}>Eyebrow</span>
                  <input
                    className={`${inputClass} mt-1.5`}
                    value={form.eyebrow}
                    onChange={(event) => updateField("eyebrow", event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className={labelClass}>Last updated</span>
                  <input
                    className={`${inputClass} mt-1.5`}
                    value={form.lastUpdated}
                    onChange={(event) => updateField("lastUpdated", event.target.value)}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelClass}>Title</span>
                  <input
                    className={`${inputClass} mt-1.5`}
                    value={form.title}
                    onChange={(event) => updateField("title", event.target.value)}
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelClass}>Intro paragraph</span>
                  <textarea
                    rows={3}
                    className={`${inputClass} mt-1.5 resize-y`}
                    value={form.intro}
                    onChange={(event) => updateField("intro", event.target.value)}
                  />
                </label>
              </div>
              <label className="mt-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(event) => updateField("published", event.target.checked)}
                  className="h-4 w-4 rounded border-stone-300 accent-[#4A2A08]"
                />
                <span className="font-sans text-sm text-stone-700">
                  Published on the public site
                </span>
              </label>
            </DashboardPanel>

            <DashboardPanel
              title="Section cards"
              description="The main article cards rendered in a two-column grid."
            >
              <div className="space-y-3">
                {(form.sections || []).map((section, index) => (
                  <div
                    key={`section-${index}`}
                    className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                  >
                    <div className="grid gap-3 sm:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)_auto]">
                      <input
                        className={inputClass}
                        placeholder="Heading"
                        value={section.heading}
                        onChange={(event) =>
                          updateRow("sections", index, { heading: event.target.value })
                        }
                      />
                      <input
                        className={inputClass}
                        placeholder="Paragraph"
                        value={section.body}
                        onChange={(event) =>
                          updateRow("sections", index, { body: event.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeRow("sections", index)}
                        className="self-center rounded-lg px-3 py-2 font-sans text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addRow("sections")}
                className="mt-4 rounded-xl border-2 border-dashed border-stone-300 px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-stone-600 transition-colors hover:border-[#4A2A08] hover:text-[#4A2A08]"
              >
                Add section card
              </button>
            </DashboardPanel>

            <DashboardPanel
              title="Clause panels"
              description="Bullet panels such as GDPR rights or refund scenarios. One bullet per line."
            >
              <div className="space-y-3">
                {(form.clauses || []).map((clause, index) => (
                  <div
                    key={`clause-${index}`}
                    className="rounded-2xl border border-stone-200 bg-stone-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <input
                        className={inputClass}
                        placeholder="Panel heading"
                        value={clause.heading}
                        onChange={(event) =>
                          updateRow("clauses", index, { heading: event.target.value })
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeRow("clauses", index)}
                        className="shrink-0 rounded-lg px-3 py-2 font-sans text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      className={`${inputClass} mt-2 resize-y`}
                      placeholder="One bullet per line"
                      value={(clause.items || []).join("\n")}
                      onChange={(event) =>
                        updateRow("clauses", index, {
                          items: event.target.value.split("\n"),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addRow("clauses")}
                className="mt-4 rounded-xl border-2 border-dashed border-stone-300 px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-stone-600 transition-colors hover:border-[#4A2A08] hover:text-[#4A2A08]"
              >
                Add clause panel
              </button>
            </DashboardPanel>

            <DashboardPanel
              title="Contact rows"
              description="Support and billing contact lines rendered as mailto links."
            >
              <div className="space-y-3">
                {(form.contacts || []).map((contact, index) => (
                  <div
                    key={`contact-${index}`}
                    className="flex items-center gap-3"
                  >
                    <input
                      className={`${inputClass} flex-1`}
                      placeholder="Label"
                      value={contact.label}
                      onChange={(event) =>
                        updateRow("contacts", index, { label: event.target.value })
                      }
                    />
                    <input
                      className={`${inputClass} flex-1`}
                      placeholder="Email"
                      value={contact.email}
                      onChange={(event) =>
                        updateRow("contacts", index, { email: event.target.value })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeRow("contacts", index)}
                      className="shrink-0 rounded-lg px-3 py-2 font-sans text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addRow("contacts")}
                className="mt-4 rounded-xl border-2 border-dashed border-stone-300 px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-[0.16em] text-stone-600 transition-colors hover:border-[#4A2A08] hover:text-[#4A2A08]"
              >
                Add contact row
              </button>
            </DashboardPanel>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-[#4A2A08] px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-stone-800 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving…" : "Publish content"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isResetting}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border-2 border-stone-300 px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-stone-700 transition-colors hover:bg-stone-100 disabled:opacity-60"
              >
                <RefreshCw className="h-4 w-4" />
                {isResetting ? "Restoring…" : "Restore default"}
              </button>
            </div>
            <p className="flex items-center gap-2 font-sans text-xs text-stone-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              The public pages read from the backend endpoint, so publishing
              here updates /terms, /privacy, /refund, and /cookies instantly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}