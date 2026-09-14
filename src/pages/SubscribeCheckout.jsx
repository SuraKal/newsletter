import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import CheckoutProgress from "@/components/forms/CheckoutProgress";
import ReaderPlanPicker from "@/components/forms/ReaderPlanPicker";
import SubscriptionOrderSummary from "@/components/forms/SubscriptionOrderSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { appParams } from "@/lib/app-params";
import { useAuth } from "@/lib/AuthContext";
import { readerCheckoutSteps, readerPaymentMethods } from "@/lib/demoData";
import { getReaderPlans, useSubscriptionPlans } from "@/lib/subscription-catalog";

const checkoutStorageKey = `${appParams.storagePrefix}_checkout_sessions`;

const formatDateLabel = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

const addMonths = (date, count) => {
  const next = new Date(date);
  next.setMonth(next.getMonth() + count);
  return next;
};

const addDays = (date, count) => {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
};

const getQuote = (plan, billingCycle) => {
  const today = new Date();
  const amount =
    billingCycle === "yearly"
      ? Number(plan.yearlyPrice ?? plan.monthlyPrice * 12)
      : plan.monthlyPrice;

  return {
    amount,
    billingCycle,
    deliveryMode:
      plan.id === "print-digital" ? "Biweekly print + digital" : "Digital access only",
    deliveryWindow:
      plan.id === "print-digital"
        ? `Next delivery window opens ${formatDateLabel(addDays(today, 14))}`
        : "No print shipment is scheduled for the digital-only plan.",
    nextChargeDate: formatDateLabel(
      billingCycle === "yearly" ? addMonths(today, 12) : addMonths(today, 1),
    ),
  };
};

const readCheckoutSessions = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const rawValue = window.localStorage.getItem(checkoutStorageKey);
  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return {};
  }
};

const writeCheckoutSessions = (sessions) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(checkoutStorageKey, JSON.stringify(sessions));
};

export default function SubscribeCheckout() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const subscriptionPlans = useSubscriptionPlans();
  const readerCheckoutPlans = useMemo(
    () => getReaderPlans(subscriptionPlans),
    [subscriptionPlans],
  );
  const requestedPlan = searchParams.get("plan");
  const requestedBilling = searchParams.get("billing");
  const fallbackPlan =
    readerCheckoutPlans.find((plan) => plan.highlighted)?.id ||
    readerCheckoutPlans[0]?.id;
  const [planId, setPlanId] = useState(
    readerCheckoutPlans.some((plan) => plan.id === requestedPlan)
      ? requestedPlan
      : fallbackPlan,
  );
  const [billingCycle, setBillingCycle] = useState(
    requestedBilling === "yearly" ? "yearly" : "monthly",
  );
  const [paymentMethodId, setPaymentMethodId] = useState("paypal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [currentStepId, setCurrentStepId] = useState("plan");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    postalCode: "",
    country: "Belgium",
    paypalEmail: "",
    cardholderName: "",
    paymentReference: "",
    consentRecurring: false,
    consentDelivery: false,
    newsletterOptIn: false,
  });

  const selectedPlan = useMemo(
    () => readerCheckoutPlans.find((plan) => plan.id === planId) || readerCheckoutPlans[0],
    [planId, readerCheckoutPlans],
  );

  const selectedPaymentMethod = useMemo(
    () =>
      readerPaymentMethods.find((method) => method.id === paymentMethodId) ||
      readerPaymentMethods[0],
    [paymentMethodId],
  );

  const quote = useMemo(
    () => getQuote(selectedPlan, billingCycle),
    [billingCycle, selectedPlan],
  );

  useEffect(() => {
    if (!readerCheckoutPlans.some((plan) => plan.id === planId)) {
      setPlanId(
        readerCheckoutPlans.find((plan) => plan.highlighted)?.id ||
          readerCheckoutPlans[0]?.id,
      );
    }
  }, [planId, readerCheckoutPlans]);

  useEffect(() => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("plan", planId);
    nextParams.set("billing", billingCycle);
    setSearchParams(nextParams, { replace: true });
  }, [billingCycle, planId, searchParams, setSearchParams]);

  useEffect(() => {
    if (!user) {
      return;
    }

    setForm((current) => ({
      ...current,
      fullName: current.fullName || user.name || "",
      email: current.email || user.email || "",
      phone: current.phone || user.contactPhone || "",
      streetAddress: current.streetAddress || user.deliveryAddress || "",
      paypalEmail: current.paypalEmail || user.email || "",
    }));
  }, [user]);

  useEffect(() => {
    setCurrentStepId("plan");
  }, [planId, billingCycle]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const paymentMethodLabel = selectedPaymentMethod.label;

  const validateForm = () => {
    if (!form.fullName || !form.email || !form.phone) {
      setCurrentStepId("delivery");
      return "Please complete the contact section before continuing.";
    }

    if (!form.streetAddress || !form.city || !form.postalCode || !form.country) {
      setCurrentStepId("delivery");
      return "Please provide the delivery address needed for routing and account support.";
    }

    if (paymentMethodId === "paypal" && !form.paypalEmail) {
      setCurrentStepId("payment");
      return "Please provide the PayPal account email for the mocked processor return.";
    }

    if (
      (paymentMethodId === "visa" || paymentMethodId === "mastercard") &&
      (!form.cardholderName || !form.paymentReference)
    ) {
      setCurrentStepId("payment");
      return "Please provide the cardholder name and a processor reference for the selected card method.";
    }

    if (!form.consentRecurring || !form.consentDelivery) {
      setCurrentStepId("confirm");
      return "Please accept the recurring billing and delivery-data consent statements before completing checkout.";
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

    setCurrentStepId("confirm");
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 900);
      });

      const sessionId = `checkout-${Date.now()}`;
      const sessions = readCheckoutSessions();
      sessions[sessionId] = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        plan: {
          id: selectedPlan.id,
          name: selectedPlan.name,
          description: selectedPlan.description,
        },
        quote,
        customer: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          streetAddress: form.streetAddress,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        payment: {
          method: paymentMethodLabel,
          reference:
            paymentMethodId === "paypal"
              ? form.paypalEmail
              : form.paymentReference,
        },
        consent: {
          recurringBilling: form.consentRecurring,
          deliverySharing: form.consentDelivery,
          newsletterOptIn: form.newsletterOptIn,
        },
      };
      writeCheckoutSessions(sessions);

      navigate(`/subscribe/success?session=${sessionId}`, { replace: true });
    } catch {
      setError("The checkout session could not be created. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[24rem] bg-[radial-gradient(circle_at_top,_rgba(72,60,50,0.1),_transparent_62%)]" />
        <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
          <section className="grid gap-8 lg:grid-cols-[1fr_0.95fr]">
            <SubscriptionOrderSummary
              plan={selectedPlan}
              billingCycle={billingCycle}
              quote={quote}
              paymentMethodLabel={paymentMethodLabel}
            />
          </section>

          <section className="mt-10">
            <CheckoutProgress
              steps={readerCheckoutSteps}
              currentStepId={currentStepId}
            />
          </section>

          <form onSubmit={handleSubmit} className="mt-10 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="space-y-8">
              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                      Step 1
                    </p>
                    <h2 className="mt-2 font-display text-2xl font-black text-ink">
                      Plan and billing
                    </h2>
                  </div>
                </div>

                <div className="mt-6">
                  <ReaderPlanPicker
                    plans={readerCheckoutPlans}
                    selectedPlanId={planId}
                    billingCycle={billingCycle}
                    onPlanChange={setPlanId}
                    onBillingChange={setBillingCycle}
                  />
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Step 2
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-ink">
                  Contact and delivery
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input
                      id="fullName"
                      value={form.fullName}
                      onChange={(e) => updateField("fullName", e.target.value)}
                      placeholder="Subscriber name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="reader@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Contact phone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+32 ..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={form.country}
                      onChange={(e) => updateField("country", e.target.value)}
                      placeholder="Belgium"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="streetAddress">Street address</Label>
                    <Input
                      id="streetAddress"
                      value={form.streetAddress}
                      onChange={(e) => updateField("streetAddress", e.target.value)}
                      placeholder="Street, building, apartment, or office"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      placeholder="Brussels"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal code</Label>
                    <Input
                      id="postalCode"
                      value={form.postalCode}
                      onChange={(e) => updateField("postalCode", e.target.value)}
                      placeholder="1000"
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
                  Payment selection
                </h2>

                <div className="mt-6 space-y-4">
                  {readerPaymentMethods.map((method) => {
                    const isActive = method.id === paymentMethodId;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethodId(method.id);
                          setCurrentStepId("payment");
                        }}
                        className={`w-full rounded-[1.2rem] border p-4 text-left transition ${
                          isActive
                            ? "border-heritage bg-vellum/70"
                            : "border-stone-300/50 bg-paper/70 hover:border-stone-400"
                        }`}
                      >
                        <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink">
                          {method.label}
                        </p>
                        <p className="mt-2 font-body text-sm leading-6 text-redacted">
                          {method.detail}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-5">
                  {paymentMethodId === "paypal" ? (
                    <div className="space-y-2">
                      <Label htmlFor="paypalEmail">PayPal account email</Label>
                      <Input
                        id="paypalEmail"
                        type="email"
                        value={form.paypalEmail}
                        onChange={(e) => updateField("paypalEmail", e.target.value)}
                        placeholder="wallet@example.com"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardholderName">Cardholder name</Label>
                        <Input
                          id="cardholderName"
                          value={form.cardholderName}
                          onChange={(e) =>
                            updateField("cardholderName", e.target.value)
                          }
                          placeholder="Name shown on processor"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentReference">
                          Processor reference or last 4 digits
                        </Label>
                        <Input
                          id="paymentReference"
                          value={form.paymentReference}
                          onChange={(e) =>
                            updateField("paymentReference", e.target.value)
                          }
                          placeholder="4242"
                        />
                      </div>
                    </>
                  )}
                </div>
              </section>

              <section className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                  Step 4
                </p>
                <h2 className="mt-2 font-display text-2xl font-black text-ink">
                  Confirm and complete
                </h2>

                <div className="mt-5 space-y-4 rounded-[1.2rem] border border-stone-300/50 bg-vellum/45 p-5">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.consentRecurring}
                      onChange={(e) =>
                        updateField("consentRecurring", e.target.checked)
                      }
                      className="mt-1 accent-heritage"
                    />
                    <span className="font-body text-sm leading-6 text-ink">
                      I understand this is a recurring subscription billed {billingCycle === "yearly" ? "yearly" : "monthly"} until it is cancelled under the plan terms.
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.consentDelivery}
                      onChange={(e) =>
                        updateField("consentDelivery", e.target.checked)
                      }
                      className="mt-1 accent-heritage"
                    />
                    <span className="font-body text-sm leading-6 text-ink">
                      I agree that my contact and address information may be used for billing, delivery coordination, and logistics handoff where physical newspaper fulfillment applies.
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.newsletterOptIn}
                      onChange={(e) =>
                        updateField("newsletterOptIn", e.target.checked)
                      }
                      className="mt-1 accent-heritage"
                    />
                    <span className="font-body text-sm leading-6 text-ink">
                      Send me editorial product updates and subscriber news.
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
                    type="submit"
                    disabled={isSubmitting}
                    className="h-12 flex-1 rounded-2xl bg-heritage px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-paper hover:bg-ink"
                  >
                    {isSubmitting ? "Completing checkout..." : "Complete checkout"}
                    {!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/subscriptions")}
                    className="h-12 rounded-2xl border-2 border-ink px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink"
                  >
                    Back to plans
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
