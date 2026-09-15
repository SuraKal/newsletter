import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import CheckoutProgress from "@/components/forms/CheckoutProgress";
import BusinessRequestSummary from "@/components/forms/BusinessRequestSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/AuthContext";
import { appParams } from "@/lib/app-params";
import {
  getCompanyEntityById,
  saveCompanyLeadDraft,
  submitCompanyLead,
} from "@/lib/company-store";
import {
  businessApplySteps,
  businessIntakeOptions,
} from "@/lib/demoData";

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

const writeBusinessLeads = (leads) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(businessLeadStorageKey, JSON.stringify(leads));
};

export default function BusinessApply() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const draftId = searchParams.get("draft");
  const [currentStepId, setCurrentStepId] = useState("profile");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    primaryContact: user?.name || "",
    workEmail: user?.email || "",
    workPhone: user?.contactPhone || "",
    organizationName: user?.companyName || "",
    requestType: businessIntakeOptions.requestTypes[0],
    companySize: businessIntakeOptions.companySizes[0],
    countryScope: businessIntakeOptions.countryScopes[0],
    expectedCopies: "",
    deliveryLocations: "",
    billingPreference: businessIntakeOptions.billingPreferences[0],
    launchTimeline: businessIntakeOptions.launchTimelines[0],
    purchasingOwner: "",
    vatOrTaxContext: "",
    invoiceReference: "",
    operationalNotes: "",
    consentCommercial: false,
    consentLogistics: false,
  });

  useEffect(() => {
    if (!draftId) return;
    const draft = getCompanyEntityById(draftId)?.lead;
    if (draft) {
      setForm((current) => ({ ...current, ...draft }));
    }
  }, [draftId]);

  const selectedRequestType = useMemo(
    () => form.requestType || businessIntakeOptions.requestTypes[0],
    [form.requestType],
  );

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const validateForm = () => {
    if (!form.primaryContact || !form.workEmail || !form.organizationName) {
      setCurrentStepId("profile");
      return "Please complete the contact and organization profile before submitting the business request.";
    }

    if (!form.expectedCopies || !form.deliveryLocations) {
      setCurrentStepId("operations");
      return "Please describe expected copy volume and delivery location scope.";
    }

    if (!form.billingPreference || !form.launchTimeline) {
      setCurrentStepId("billing");
      return "Please confirm billing preference and launch timing.";
    }

    if (!form.consentCommercial || !form.consentLogistics) {
      setCurrentStepId("submit");
      return "Please accept the consent statements for commercial follow-up and logistics planning.";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationMessage = validateForm();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    setCurrentStepId("submit");
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 900);
      });

      const requestId = draftId || `business-lead-${Date.now()}`;
      const leads = readBusinessLeads();
      leads[requestId] = {
        id: requestId,
        createdAt: new Date().toISOString(),
        ...form,
      };
      writeBusinessLeads(leads);
      submitCompanyLead(leads[requestId]);

      navigate(`/business/apply/success?request=${requestId}`, {
        replace: true,
      });
    } catch {
      setError("The business request could not be saved. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setError("");
    const requestId = draftId || `business-draft-${Date.now()}`;
    const record = {
      id: requestId,
      createdAt: new Date().toISOString(),
      ...form,
    };
    const leads = readBusinessLeads();
    leads[requestId] = record;
    writeBusinessLeads(leads);
    saveCompanyLeadDraft(record);
    navigate(`/business/apply/success?request=${requestId}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(circle_at_top,_rgba(72,60,50,0.1),_transparent_62%)]" />
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <section className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <BusinessRequestSummary
              form={form}
              selectedRequestType={selectedRequestType}
            />
          </section>

          <section className="mt-10">
            <CheckoutProgress
              steps={businessApplySteps}
              currentStepId={currentStepId}
            />
          </section>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Step 1
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-ink">
                  Organization profile
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryContact">Primary contact</Label>
                    <Input
                      id="primaryContact"
                      value={form.primaryContact}
                      onChange={(e) => updateField("primaryContact", e.target.value)}
                      placeholder="Operations or purchasing lead"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workEmail">Work email</Label>
                    <Input
                      id="workEmail"
                      type="email"
                      value={form.workEmail}
                      onChange={(e) => updateField("workEmail", e.target.value)}
                      placeholder="team@company.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workPhone">Work phone</Label>
                    <Input
                      id="workPhone"
                      value={form.workPhone}
                      onChange={(e) => updateField("workPhone", e.target.value)}
                      placeholder="+32 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization</Label>
                    <Input
                      id="organizationName"
                      value={form.organizationName}
                      onChange={(e) => updateField("organizationName", e.target.value)}
                      placeholder="Company, hotel group, or institution"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="requestType">Request type</Label>
                    <select
                      id="requestType"
                      value={form.requestType}
                      onChange={(e) => updateField("requestType", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {businessIntakeOptions.requestTypes.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company size</Label>
                    <select
                      id="companySize"
                      value={form.companySize}
                      onChange={(e) => updateField("companySize", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {businessIntakeOptions.companySizes.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="countryScope">Country scope</Label>
                    <select
                      id="countryScope"
                      value={form.countryScope}
                      onChange={(e) => updateField("countryScope", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {businessIntakeOptions.countryScopes.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Step 2
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-ink">
                  Fulfillment footprint
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="expectedCopies">Estimated copies per delivery</Label>
                    <Input
                      id="expectedCopies"
                      value={form.expectedCopies}
                      onChange={(e) => updateField("expectedCopies", e.target.value)}
                      placeholder="120 copies every two weeks"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryLocations">Delivery locations</Label>
                    <Input
                      id="deliveryLocations"
                      value={form.deliveryLocations}
                      onChange={(e) => updateField("deliveryLocations", e.target.value)}
                      placeholder="3 offices and 2 partner sites"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="launchTimeline">Launch timeline</Label>
                    <select
                      id="launchTimeline"
                      value={form.launchTimeline}
                      onChange={(e) => updateField("launchTimeline", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {businessIntakeOptions.launchTimelines.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="operationalNotes">Operational notes</Label>
                    <Textarea
                      id="operationalNotes"
                      value={form.operationalNotes}
                      onChange={(e) => updateField("operationalNotes", e.target.value)}
                      rows={6}
                      placeholder="Share routing constraints, hotel or branch distribution logic, receiving windows, or country-specific delivery details."
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Step 3
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-ink">
                  Billing and quote readiness
                </h2>

                <div className="mt-6 grid gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="billingPreference">Billing preference</Label>
                    <select
                      id="billingPreference"
                      value={form.billingPreference}
                      onChange={(e) => updateField("billingPreference", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {businessIntakeOptions.billingPreferences.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchasingOwner">Purchasing or approval owner</Label>
                    <Input
                      id="purchasingOwner"
                      value={form.purchasingOwner}
                      onChange={(e) => updateField("purchasingOwner", e.target.value)}
                      placeholder="Finance manager, procurement lead, or owner"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invoiceReference">Purchase order or invoice reference</Label>
                    <Input
                      id="invoiceReference"
                      value={form.invoiceReference}
                      onChange={(e) => updateField("invoiceReference", e.target.value)}
                      placeholder="Optional PO, cost center, or invoice note"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatOrTaxContext">VAT or tax context</Label>
                    <Input
                      id="vatOrTaxContext"
                      value={form.vatOrTaxContext}
                      onChange={(e) => updateField("vatOrTaxContext", e.target.value)}
                      placeholder="Belgium VAT, Germany VAT, exempt, or need guidance"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Step 4
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-ink">
                  Submit business request
                </h2>

                <div className="mt-5 space-y-4 rounded-[1.2rem] border border-stone-300/50 bg-vellum/45 p-5">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.consentCommercial}
                      onChange={(e) =>
                        updateField("consentCommercial", e.target.checked)
                      }
                      className="mt-1 accent-heritage"
                    />
                    <span className="font-body text-sm leading-6 text-ink">
                      I agree that the commercial team may use this organization and contact information for quote follow-up, rollout planning, and account setup discussions.
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.consentLogistics}
                      onChange={(e) =>
                        updateField("consentLogistics", e.target.checked)
                      }
                      className="mt-1 accent-heritage"
                    />
                    <span className="font-body text-sm leading-6 text-ink">
                      I understand that delivery footprint details may be used to evaluate routing, country coverage, and logistics feasibility during the onboarding process.
                    </span>
                  </label>
                </div>

                {error ? (
                  <div className="mt-5 rounded-[1rem] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                ) : null}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSubmitting}
                    className="h-12 rounded-2xl border-2 border-stone-300 px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink"
                  >
                    Save draft
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 flex-1 rounded-2xl bg-heritage px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-paper hover:bg-ink"
                  >
                    {isSubmitting ? "Submitting request..." : "Submit business request"}
                    {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/business")}
                    className="h-12 rounded-2xl border-2 border-ink px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink"
                  >
                    Back to business page
                  </Button>
                </div>
              </section>
            </div>
          </form>

        </div>
      </main>
      <Footer />
    </div>
  );
}
