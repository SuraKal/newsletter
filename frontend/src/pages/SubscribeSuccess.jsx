import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Newspaper,
  RefreshCw,
  XCircle,
} from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { appClient } from "@/api/appClient";
import { useAuth } from "@/lib/AuthContext";

const statusContent = {
  succeeded: {
    label: "Payment confirmed",
    title: "Subscription ready",
    message: "Your payment was confirmed and your reader access is now active.",
    tone: "success",
    Icon: CheckCircle2,
  },
  failed: {
    label: "Payment failed",
    title: "Payment was not completed",
    message: "The payment returned a failed status. Your subscription has not been activated.",
    tone: "danger",
    Icon: AlertCircle,
  },
  cancelled: {
    label: "Payment cancelled",
    title: "Payment was cancelled",
    message: "You left the payment flow before completing it. Your plan and billing choice are still available to retry.",
    tone: "neutral",
    Icon: XCircle,
  },
  pending: {
    label: "Payment pending",
    title: "Payment is being reviewed",
    message: "The payment has not been confirmed yet. Reader access remains inactive until confirmation.",
    tone: "warning",
    Icon: Clock3,
  },
  expired: {
    label: "Session expired",
    title: "This checkout session is no longer available",
    message: "Start a new checkout session to confirm the current plan price and billing cycle.",
    tone: "danger",
    Icon: AlertCircle,
  },
};

const statusToneClass = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  danger: "border-red-200 bg-red-50 text-red-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  neutral: "border-stone-300 bg-stone-100 text-stone-800",
};

export default function SubscribeSuccess() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const sessionId = searchParams.get("session");
  const intentId = searchParams.get("payment_intent");
  const redirectSucceeded = searchParams.get("redirect_status") === "succeeded";
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      // Returning from a Stripe redirect after strong customer authentication:
      // finalize the backend checkout with the confirmed PaymentIntent first.
      if (intentId && redirectSucceeded) {
        try {
          await appClient.checkout.confirm(sessionId, {
            paymentIntentId: intentId,
          });
        } catch {
          // Fall through to the plain session read below; the status shown
          // will reflect whatever the backend reports.
        }
      }

      let loaded = null;
      try {
        loaded = await appClient.checkout.get(sessionId);
      } catch {
        loaded = null;
      }

      if (!cancelled) {
        setSession(loaded);
        setIsLoading(false);
      }
    };

    loadSession();
    return () => {
      cancelled = true;
    };
  }, [sessionId, intentId, redirectSucceeded]);

  const paymentStatus = session?.status || "expired";
  const status = statusContent[paymentStatus] || statusContent.expired;
  const StatusIcon = status.Icon;
  const isSuccessful = paymentStatus === "succeeded";
  const retryUrl = session
    ? `/subscribe/checkout?plan=${session.plan.id}&billing=${session.quote.billingCycle}`
    : "/subscriptions";

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="mx-auto max-w-6xl px-4 py-12 lg:py-16">
        {isLoading ? (
          <section className="rounded-[2rem] border border-stone-300/60 bg-paper p-8 shadow-[0_25px_80px_rgba(40,30,20,0.08)]">
            <p className="font-body text-base leading-7 text-redacted" role="status">
              Loading confirmation details…
            </p>
          </section>
        ) : (
          <>
            <section className={`rounded-[2rem] border p-8 shadow-[0_25px_80px_rgba(40,30,20,0.08)] ${statusToneClass[status.tone]}`}>
              <div className="flex items-start gap-4">
                <StatusIcon className="mt-1 h-6 w-6 shrink-0" />
                <div>
                  <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.2em]">
                    {status.label}
                  </p>
                  <h1 className="mt-2 font-display text-3xl font-black md:text-5xl">
                    {status.title}
                  </h1>
                  <p className="mt-3 max-w-2xl font-body text-base leading-7">
                    {session?.statusMessage || status.message}
                  </p>
                </div>
              </div>
            </section>

            {session && isSuccessful ? (
              <>
                <section className="mt-10">
                  <div className="rounded-[1.6rem] border border-stone-300/60 bg-paper p-6 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                    <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-heritage">
                      Confirmation details
                    </p>
                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                      <div className="rounded-[1.1rem] border border-stone-300/50 bg-vellum/50 p-4">
                        <div className="flex items-start gap-3">
                          <Newspaper className="mt-1 h-5 w-5 text-heritage" />
                          <div>
                            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-redacted">
                              Plan
                            </p>
                            <p className="mt-1 font-body text-sm text-ink">
                              {session.plan.name}
                            </p>
                            <p className="font-body text-sm text-redacted">
                              €{session.quote.amount.toFixed(2)} billed {session.quote.billingCycle}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-[1.1rem] border border-stone-300/50 bg-vellum/50 p-4">
                        <div className="flex items-start gap-3">
                          <CreditCard className="mt-1 h-5 w-5 text-heritage" />
                          <div>
                            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-redacted">
                              Payment path
                            </p>
                            <p className="mt-1 font-body text-sm text-ink">
                              {session.payment.method}
                            </p>
                            <p className="font-body text-sm text-redacted">
                              Reference: {session.payment.reference}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-[1.1rem] border border-stone-300/50 bg-vellum/50 p-4">
                        <div className="flex items-start gap-3">
                          <RefreshCw className="mt-1 h-5 w-5 text-heritage" />
                          <div>
                            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-redacted">
                              Renewal
                            </p>
                            <p className="mt-1 font-body text-sm text-ink">
                              {session.quote.nextChargeDate}
                            </p>
                            <p className="font-body text-sm text-redacted">
                              €{session.quote.amount.toFixed(2)} due today · {session.quote.billingCycle} renewal
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="rounded-[1.1rem] border border-stone-300/50 bg-vellum/50 p-4 md:col-span-2">
                        <div className="flex items-start gap-3">
                          <MapPin className="mt-1 h-5 w-5 text-heritage" />
                          <div>
                            <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-redacted">
                              Delivery profile
                            </p>
                            <p className="mt-1 font-body text-sm text-ink">
                              {session.customer.streetAddress}, {session.customer.city},{" "}
                              {session.customer.postalCode}, {session.customer.country}
                            </p>
                            <p className="font-body text-sm text-redacted">
                              {session.quote.deliveryMode}. {session.quote.deliveryWindow}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 rounded-[1.1rem] border border-stone-300/50 bg-vellum/50 p-4">
                      <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-redacted">
                        Plan features
                      </p>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {(session.plan.features || []).map((feature) => (
                          <li key={feature} className="flex items-start gap-2 font-body text-sm text-ink">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-heritage" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={isAuthenticated ? "/dashboard/overview" : "/register?journey=individual"}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-heritage px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink"
                  >
                    {isAuthenticated ? "Open reader dashboard" : "Create reader account"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/subscriptions"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-ink px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    Back to subscription plans
                  </Link>
                </section>
              </>
            ) : session ? (
              <section className="mt-10 rounded-[1.5rem] border border-stone-300/60 bg-paper p-8 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-body text-base leading-7 text-redacted">
                  This attempt was recorded as <strong className="text-ink">{paymentStatus}</strong>. Reader access remains inactive until the payment is successful.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to={retryUrl}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-heritage px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Try checkout again
                  </Link>
                  <Link
                    to="/subscriptions"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-ink px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    Back to subscription plans
                  </Link>
                </div>
              </section>
            ) : (
              <section className="mt-10 rounded-[1.5rem] border border-stone-300/60 bg-paper p-8 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
                <p className="font-body text-base leading-7 text-redacted">
                  Start a new checkout session from the reader subscription plans to continue.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link
                    to="/subscriptions"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-heritage px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink"
                  >
                    Open subscription plans
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/login?journey=individual"
                    className="inline-flex h-12 items-center justify-center rounded-2xl border-2 border-ink px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink transition-colors hover:bg-ink hover:text-paper"
                  >
                    Reader sign in
                  </Link>
                </div>
              </section>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}