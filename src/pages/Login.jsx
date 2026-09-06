import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  KeyRound,
  Lock,
  Mail,
  Newspaper,
  ShieldCheck,
} from "lucide-react";
import { authJourneyContent, useAuth } from "@/lib/AuthContext";
import { appClient } from "@/api/appClient";
import { appParams } from "@/lib/app-params";
import { getDefaultDashboardRoute } from "@/lib/dashboard-config";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

const journeyOptions = [
  {
    key: "individual",
    icon: Newspaper,
    title: "Individual reader",
    detail:
      "Reading access, payment history, and one household delivery path.",
    highlights: [
      "Morning briefings and curated front-page coverage",
      "Saved articles and reading history across devices",
      "Personal billing and next-edition delivery visibility",
    ],
    note:
      "Use the reader journey for one-person subscriptions, account updates, and home delivery tracking.",
  },
  {
    key: "business",
    icon: Building2,
    title: "Company account",
    detail:
      "Bulk copies, consolidated billing, and operational shipment visibility.",
    highlights: [
      "Shared shipment visibility across company delivery points",
      "Invoice-friendly account access for contract and billing teams",
      "Operational oversight for orders, locations, and upcoming runs",
    ],
    note:
      "Use the business journey when your account manages multiple copies, company invoicing, or several delivery locations.",
  },
];

const demoAccounts = [
  {
    key: "individual",
    label: "Demo Reader",
    email: appParams.readerEmail,
    password: appParams.readerPassword,
  },
  {
    key: "business",
    label: "Demo Business",
    email: appParams.businessEmail,
    password: appParams.businessPassword,
  },
  {
    key: "admin",
    label: "Demo Admin",
    email: appParams.adminEmail,
    password: appParams.adminPassword,
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { checkUserAuth } = useAuth();
  const journeyKey =
    searchParams.get("journey") === "business" ? "business" : "individual";
  const selectedJourney =
    journeyOptions.find((option) => option.key === journeyKey) ||
    journeyOptions[0];

  const selectJourney = (nextJourney) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("journey", nextJourney);
    setSearchParams(nextParams, { replace: true });
  };

  const fillDemoCredentials = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    if (account.key === "individual" || account.key === "business") {
      selectJourney(account.key);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const signedInUser = await appClient.auth.login({
        email,
        password,
        rememberMe,
      });
      await checkUserAuth();
      navigate(
        searchParams.get("from") || getDefaultDashboardRoute(signedInUser.role),
        { replace: true },
      );
    } catch (authError) {
      setError(authError.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(72,60,50,0.1),_transparent_60%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:py-20">
          <section className="relative overflow-hidden rounded-[2rem] border border-stone-300/50 bg-vellum/70 p-8 shadow-[0_25px_80px_rgba(40,30,20,0.08)] lg:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-heritage/10 blur-3xl" />
            <div className="relative">
              <p className="category-label">Member Access</p>
              <h1 className="mt-4 max-w-xl font-display text-4xl font-black leading-tight text-ink md:text-5xl">
                Choose the right account path before you return to the newsroom.
              </h1>
              <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-redacted md:text-lg">
                Individual subscribers and company teams share the same
                product, but not the same onboarding and dashboard
                expectations. Start in the journey that matches your account so
                the next step stays clear.
              </p>

              <div className="newspaper-rule-double my-8" />

              <div className="grid gap-4 sm:grid-cols-2">
                {journeyOptions.map((option) => {
                  const OptionIcon = option.icon;
                  const isActive = option.key === journeyKey;

                  return (
                    <button
                      key={option.key}
                      type="button"
                      onClick={() => selectJourney(option.key)}
                      className={`rounded-[1.5rem] border p-5 text-left transition ${
                        isActive
                          ? "border-heritage bg-paper shadow-[0_18px_38px_rgba(76,43,8,0.08)]"
                          : "border-stone-300/50 bg-paper/80 hover:border-stone-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-300/60 bg-vellum">
                          <OptionIcon className="h-5 w-5 text-heritage" />
                        </div>
                        <div>
                          <p className="font-sans text-[0.64rem] font-bold uppercase tracking-[0.24em] text-heritage">
                            {authJourneyContent[option.key].eyebrow}
                          </p>
                          <p className="mt-1 font-display text-xl font-bold text-ink">
                            {option.title}
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 font-body text-sm leading-6 text-redacted">
                        {option.detail}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {selectedJourney.highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.25rem] border border-stone-300/50 bg-paper/80 p-4"
                  >
                    <ShieldCheck className="h-5 w-5 text-heritage" />
                    <p className="mt-3 font-body text-sm leading-6 text-ink">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[1.5rem] border border-stone-300/50 bg-paper/80 p-6">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-heritage">
                  Journey Note
                </p>
                <p className="mt-4 font-body text-lg leading-relaxed text-ink">
                  {selectedJourney.note}
                </p>
                <p className="mt-3 font-sans text-xs uppercase tracking-[0.24em] text-redacted">
                  Account Routing
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-stone-300/50 bg-paper p-6 shadow-[0_20px_70px_rgba(30,20,10,0.08)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-heritage">
                  {journeyKey === "business"
                    ? "Business Sign In"
                    : "Reader Sign In"}
                </p>
                <h2 className="mt-2 font-display text-3xl font-black text-ink">
                  Welcome back
                </h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-stone-300/60 bg-vellum">
                <KeyRound className="h-6 w-6 text-heritage" />
              </div>
            </div>

            <p className="mt-4 font-body text-sm leading-6 text-redacted">
              {journeyKey === "business"
                ? "Enter the company account credentials used for invoicing, locations, and bulk delivery oversight."
                : "Enter your personal subscriber email and password to continue to reading access, billing, and delivery tracking."}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 font-sans text-xs text-red-700">
                  {error}
                </div>
              ) : null}

              <label className="block">
                <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink">
                  Email
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-300/70 bg-vellum/35 px-4 py-3 focus-within:border-heritage">
                  <Mail className="h-4 w-4 text-redacted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={
                      journeyKey === "business"
                        ? "operations@company.com"
                        : "reader@nekedem.local"
                    }
                    className="w-full bg-transparent font-body text-sm text-ink outline-none placeholder:text-redacted/60"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink">
                  Password
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-300/70 bg-vellum/35 px-4 py-3 focus-within:border-heritage">
                  <Lock className="h-4 w-4 text-redacted" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full bg-transparent font-body text-sm text-ink outline-none placeholder:text-redacted/60"
                  />
                </div>
              </label>

              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-heritage"
                  />
                  <span className="font-sans text-xs text-redacted">
                    Keep me signed in
                  </span>
                </label>
                <Link
                  to={`/forgot-password?journey=${journeyKey}`}
                  className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-heritage hover:underline"
                >
                  Forgot password
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-heritage px-6 py-4 font-sans text-xs font-bold uppercase tracking-[0.24em] text-paper transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>{loading ? "Signing In..." : "Enter Newsroom"}</span>
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>

            <div className="newspaper-rule my-8" />

            <div className="grid gap-3 sm:grid-cols-3">
              {demoAccounts.map((account) => (
                <button
                  key={account.key}
                  type="button"
                  onClick={() => fillDemoCredentials(account)}
                  className="rounded-[1.25rem] border border-stone-300/50 bg-vellum/45 p-4 text-left transition hover:border-stone-400 hover:bg-vellum/65"
                >
                  <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em] text-heritage">
                    {account.label}
                  </p>
                  <p className="mt-3 break-all font-body text-sm text-ink">
                    {account.email}
                  </p>
                  <p className="font-sans text-xs text-redacted">
                    {account.password}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="font-sans text-xs text-redacted">
                Don't have an account?{" "}
                <Link
                  to={`/register?journey=${journeyKey}`}
                  className="font-semibold uppercase tracking-[0.16em] text-heritage hover:underline"
                >
                  Create one
                </Link>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
