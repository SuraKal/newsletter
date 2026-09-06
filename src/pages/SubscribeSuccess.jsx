import React, { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, CreditCard, MapPin, Newspaper } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { appParams } from "@/lib/app-params";
import { useAuth } from "@/lib/AuthContext";

const checkoutStorageKey = `${appParams.storagePrefix}_checkout_sessions`;

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

export default function SubscribeSuccess() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const sessionId = searchParams.get("session");

  const session = useMemo(() => {
    if (!sessionId) {
      return null;
    }

    const sessions = readCheckoutSessions();
    return sessions[sessionId] || null;
  }, [sessionId]);

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
                    Payment return mocked successfully
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {session ? (
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
        ) : (
          <section className="mt-10 rounded-[1.5rem] border border-stone-300/60 bg-paper p-8 shadow-[0_16px_38px_rgba(0,0,0,0.04)]">
            <p className="font-body text-base leading-7 text-redacted">
              A success route was opened without a saved checkout session. Start again from the
              reader subscription plans to generate a mocked checkout return.
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
      </main>
      <Footer />
    </div>
  );
}
