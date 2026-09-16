import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Building2, CheckCircle2, MapPinned, ReceiptText } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { appParams } from "@/lib/app-params";
import { backendCompanies, isNetworkError } from "@/api/backendClient";
import {
  getCompanyEntityById,
  getCompanyWorkflowPresentation,
} from "@/lib/company-store";
import { useStoreVersion } from "@/lib/store-bus";

const businessLeadStorageKey = `${appParams.storagePrefix}_business_leads`;

const readBusinessLeads = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const rawValue = window.localStorage.getItem(businessLeadStorageKey);
  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return {};
  }
};

export default function BusinessApplySuccess() {
  useStoreVersion();
  const [searchParams] = useSearchParams();
  const requestId = searchParams.get("request");

  // The mock entity is the instant offline baseline; the backend entity — when
  // reachable — replaces it so the page tracks the true live workflow state.
  const mockEntity = useMemo(
    () => (requestId ? getCompanyEntityById(requestId) : null),
    [requestId],
  );
  const [fetchedEntity, setFetchedEntity] = useState(null);

  useEffect(() => {
    if (!requestId) return;
    let cancelled = false;
    setFetchedEntity(null);
    backendCompanies
      .getMyApplication(requestId)
      .then((record) => {
        if (!cancelled && record) setFetchedEntity(record);
      })
      .catch((error) => {
        if (!isNetworkError(error)) {
          // Keep the mock fallback; non-network errors (e.g. 404) fall through.
        }
      });
    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const request = useMemo(() => {
    if (!requestId) {
      return null;
    }

    const leads = readBusinessLeads();
    return leads[requestId] || null;
  }, [requestId]);

  const entity = fetchedEntity || mockEntity;
  const workflow = getCompanyWorkflowPresentation(entity);
  const requestDetails = entity?.lead || request;

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        <section className="rounded-[2rem] border border-stone-300/60 bg-vellum/75 p-8 shadow-[0_25px_80px_rgba(40,30,20,0.08)]">
          <div className="flex items-center justify-end">
            <div className="rounded-[1.3rem] border border-emerald-200 bg-emerald-50 px-5 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-700" />
                <div>
                  <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em] text-emerald-700">
                    Status
                  </p>
                  <p className="font-body text-sm text-emerald-900">
                    {workflow.label}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {requestDetails ? (
          <>
            <section className="mt-10">
              <div className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Request details
                </p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="rounded-[1.1rem] border border-stone-300/50 bg-vellum/50 p-4">
                    <div className="flex items-start gap-3">
                      <Building2 className="mt-1 h-5 w-5 text-heritage" />
                      <div>
                        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-redacted">
                          Organization
                        </p>
                        <p className="mt-1 font-body text-sm text-ink">
                          {requestDetails.organizationName}
                        </p>
                        <p className="font-body text-sm text-redacted">
                          {requestDetails.requestType} · {requestDetails.companySize}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.1rem] border border-stone-300/50 bg-vellum/50 p-4">
                    <div className="flex items-start gap-3">
                      <ReceiptText className="mt-1 h-5 w-5 text-heritage" />
                      <div>
                        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-redacted">
                          Billing path
                        </p>
                        <p className="mt-1 font-body text-sm text-ink">
                          {requestDetails.billingPreference}
                        </p>
                        <p className="font-body text-sm text-redacted">
                          {requestDetails.invoiceReference || "No invoice reference provided yet"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.1rem] border border-stone-300/50 bg-vellum/50 p-4 md:col-span-2">
                    <div className="flex items-start gap-3">
                      <MapPinned className="mt-1 h-5 w-5 text-heritage" />
                      <div>
                        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-redacted">
                          Fulfillment footprint
                        </p>
                        <p className="mt-1 font-body text-sm text-ink">
                          {requestDetails.expectedCopies} copies across {requestDetails.deliveryLocations}
                        </p>
                        <p className="font-body text-sm text-redacted">
                          {requestDetails.countryScope} · {requestDetails.launchTimeline}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.1rem] border border-stone-300/50 bg-vellum/50 p-4 md:col-span-2">
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-redacted">
                      Contact and notes
                    </p>
                    <p className="mt-2 font-body text-sm text-ink">
                      {requestDetails.primaryContact} · {requestDetails.workEmail}
                    </p>
                    <p className="font-body text-sm text-redacted">
                      {requestDetails.workPhone || "No work phone provided"}
                    </p>
                    <p className="mt-3 font-body text-sm leading-6 text-redacted">
                      {requestDetails.operationalNotes || "No operational notes were added."}
                    </p>
                  </div>
                </div>
                <div className="mt-6 rounded-[1.1rem] border border-stone-300/50 bg-vellum/50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-redacted">
                        Workflow status
                      </p>
                      <p className="mt-1 font-body text-sm text-ink">
                        {workflow.detail}
                      </p>
                    </div>
                    <span className="inline-flex w-fit rounded-full border border-stone-300 bg-paper px-3 py-1 font-sans text-xs font-bold uppercase tracking-[0.14em] text-ink">
                      {workflow.label}
                    </span>
                  </div>
                  {entity?.quote ? (
                    <div className="mt-4 grid gap-3 border-t border-stone-300/50 pt-4 sm:grid-cols-2">
                      <p className="font-body text-sm text-ink">
                        Quote tier: <strong>{entity.quote.tier}</strong>
                      </p>
                      <p className="font-body text-sm text-ink">
                        Billing: <strong>{entity.quote.billing}</strong>
                      </p>
                      <p className="font-body text-sm text-redacted sm:col-span-2">
                        Delivery scope: {entity.quote.delivery}
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                to={workflow.actionPath}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-heritage px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink"
              >
                {workflow.action}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/business/apply"
                className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-ink px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Submit another request
              </Link>
            </section>
          </>
        ) : (
          <section className="mt-10 rounded-[1.5rem] border border-stone-300/60 bg-paper p-8 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
            <p className="font-body text-base leading-7 text-redacted">
              A business success route was opened without a saved request. Start again from the business onboarding path to generate a mocked quote submission.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/business/apply"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-heritage px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink"
              >
                Start business onboarding
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/business"
                className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-ink px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                Business overview
              </Link>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
