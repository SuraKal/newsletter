import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DashboardStatusBadge } from "@/components/dashboard/DashboardPrimitives";

export default function GovernanceRequestPanel({
  notes,
  onNotesChange,
  onExport,
  onDeletion,
  isSubmittingExport,
  isSubmittingDeletion,
  requests,
  notesConfig,
  error,
  successMessage,
  notesLabel = "Request notes",
  notesPlaceholder = "Add context for export packaging, retention review, or deletion questions.",
  exportLabel = "Request data export",
  exportLoadingLabel = "Requesting export...",
  deletionLabel = "Request deletion review",
  deletionLoadingLabel = "Requesting deletion...",
  requestsTitle = "Recent governance requests",
  emptyStateMessage = "No export or deletion requests have been logged from this account yet.",
}) {
  return (
    <div className="space-y-5">
      {error ? (
        <div
          role="alert"
          className="rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      ) : null}

      {successMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded-[1rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          {successMessage}
        </div>
      ) : null}

      <div className="space-y-4">
        {notesConfig.map((item) => (
          <div
            key={item.title}
            className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
          >
            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
              {item.title}
            </p>
            <p className="mt-2 font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
              {item.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
          {notesLabel}
        </label>
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={5}
          placeholder={notesPlaceholder}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={onExport}
          disabled={isSubmittingExport}
          className="h-11 rounded-2xl bg-stone-900 px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-white hover:bg-stone-700"
        >
          {isSubmittingExport ? exportLoadingLabel : exportLabel}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onDeletion}
          disabled={isSubmittingDeletion}
          className="h-11 rounded-2xl border-2 border-stone-900 px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-stone-900"
        >
          {isSubmittingDeletion ? deletionLoadingLabel : deletionLabel}
        </Button>
      </div>

      <div className="space-y-3">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
          {requestsTitle}
        </p>
        {requests.length ? (
          requests.map((request) => (
            <div
              key={request.id}
              className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                    {request.type}
                  </p>
                  <p className="mt-1 font-sans text-xs text-stone-500">
                    {request.date}
                  </p>
                </div>
                <DashboardStatusBadge
                  label={request.status}
                  tone={request.status === "Queued" ? "info" : "warning"}
                />
              </div>
              <p className="mt-3 font-sans text-sm leading-6 text-stone-700 dark:text-stone-300">
                {request.notes}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-[1rem] border border-dashed border-stone-300/80 bg-stone-50/50 p-4">
            <p className="font-sans text-sm leading-6 text-stone-600 dark:text-stone-400">
              {emptyStateMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
