import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Clock3, FileText } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import AdminArticleForm from "@/components/forms/AdminArticleForm";
import { getRawArticleById, saveArticle } from "@/lib/content-store";
import { adminEditorTemplateFields } from "@/lib/demoData";

const createDefaultArticle = () => ({
  id: "new",
  headline: "",
  sector: "Politics",
  editor: "Editorial desk",
  status: "Draft",
  tone: "neutral",
  summary: "",
  author: "Nael Desk",
  publicAccessDate: "September 11, 2026",
  publishDate: "August 11, 2026",
  publishTime: "2:00 PM",
  body: "",
  councilSession: "",
  eventDate: "",
  location: "",
  scorelineFocus: "",
  marketImpact: "",
});

export default function AdminContentEditor() {
  const { id } = useParams();
  const seed = useMemo(() => {
    if (!id || id === "new") {
      return createDefaultArticle();
    }

    return getRawArticleById(id) || createDefaultArticle();
  }, [id]);

  const [form, setForm] = useState(seed);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setForm(seed);
    setSuccessMessage("");
  }, [seed]);

  const templateFields = adminEditorTemplateFields[form.sector] || [];
  const isNewArticle = id === "new";

  const handleChange = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    window.setTimeout(() => {
      const saved = saveArticle(form);
      setIsSaving(false);
      if (form.id === "new") {
        handleChange("id", saved.id);
      }
      setSuccessMessage(
        saved.status === "Published"
          ? "Article is live in the public newsroom and ready for reader access."
          : "Editorial draft saved to the publishing queue.",
      );
    }, 300);
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin editor"
        title={isNewArticle ? "Create a new article" : "Edit sector article"}
        description="The editor should make sector-specific fields, publish timing, and article state obvious without sending admins back to a generic article list."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Content", to: "/admin/content" },
          { label: isNewArticle ? "New article" : "Edit article" },
        ]}
        action={
          <Link
            to="/admin/content"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Back to content list
            <FileText className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search editorial notes or template fields"
        filters={[
          `${form.sector} template`,
          form.status,
          `${form.publishDate} · ${form.publishTime}`,
        ]}
        action={
          <Link
            to="/admin/schedule"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Publishing schedule
            <Clock3 className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardPanel
          title="Sector-aware editor"
          description="Template fields change with the article desk so publishing stays structured across politics, business, sports, and events."
        >
          <AdminArticleForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            isSaving={isSaving}
            successMessage={successMessage}
            templateFields={templateFields}
          />
        </DashboardPanel>

        <div className="space-y-4">
          <DashboardPanel
            title="Editorial state"
            description="Article state should stay visible while the editor works."
            className="h-full"
          >
            <div className="space-y-4">
              <div className="dashboard-panel-soft p-4">
                <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Current status
                </p>
                <div className="mt-3">
                  <DashboardStatusBadge label={form.status} tone={form.tone || "neutral"} />
                </div>
              </div>
              <div className="dashboard-panel-soft p-4">
                <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Publish window
                </p>
                <p className="mt-2 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {form.publishDate} · {form.publishTime}
                </p>
              </div>
              <div className="dashboard-panel-soft p-4">
                <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500">
                  Public archive date
                </p>
                <p className="mt-2 font-sans text-lg font-semibold text-stone-900 dark:text-stone-100">
                  {form.publicAccessDate}
                </p>
              </div>
            </div>
          </DashboardPanel>


        </div>
      </section>
    </div>
  );
}
