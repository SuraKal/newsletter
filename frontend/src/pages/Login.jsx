import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  KeyRound,
  Lock,
  Mail,
  Newspaper,
  ShieldCheck,
} from "lucide-react";
import { authJourneyContent, useAuth } from "@/lib/AuthContext";
import { appClient } from "@/api/appClient";
import { getDefaultDashboardRoute } from "@/lib/dashboard-config";

const journeyOptions = [
  { key: "individual", icon: Newspaper, title: "Individual reader" },
  { key: "business", icon: Building2, title: "Company account" },
  { key: "admin", icon: ShieldCheck, title: "Admin operator" },
];

const roleForJourney = {
  individual: "reader",
  business: "business",
  admin: "admin",
};

const normalizeJourney = (value) =>
  ["business", "admin"].includes(value) ? value : "individual";

const getSafeReturnPath = (from, journey) => {
  if (!from || !from.startsWith("/") || from.startsWith("//")) {
    return getDefaultDashboardRoute(roleForJourney[journey]);
  }

  const allowedPrefix = {
    individual: "/dashboard",
    business: "/business-dashboard",
    admin: "/admin",
  }[journey];

  return from === allowedPrefix || from.startsWith(`${allowedPrefix}/`)
    ? from
    : getDefaultDashboardRoute(roleForJourney[journey]);
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { checkUserAuth } = useAuth();
  const initialJourney = normalizeJourney(
    new URLSearchParams(location.search).get("journey"),
  );
  const [form, setForm] = useState({ email: "", password: "" });
  const [journeyKey, setJourneyKey] = useState(initialJourney);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const pendingApproval = searchParams.get("pending") === "license";
  const journey = authJourneyContent[journeyKey] || authJourneyContent.individual;
  const expectedRole = roleForJourney[journeyKey];
  const activeOption =
    journeyOptions.find((option) => option.key === journeyKey) ||
    journeyOptions[0];

  const updateField = (field) => (event) => {
    const nextValue = event.currentTarget.value;
    setForm((current) => ({ ...current, [field]: nextValue }));
    if (error) setError("");
  };

  const selectJourney = (nextJourney) => {
    setJourneyKey(normalizeJourney(nextJourney));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    const email = form.email.trim().toLowerCase();
    if (!email || !form.password) {
      setError("Enter your email and password to continue.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const signedInUser = await appClient.auth.login({
        email,
        password: form.password,
        rememberMe,
      });

      if (signedInUser.role !== expectedRole) {
        appClient.auth.logout();
        throw new Error(
          `This account belongs to the ${
            signedInUser.role === "business" ? "company" : signedInUser.role
          } journey. Select the matching sign-in option.`,
        );
      }

      await checkUserAuth();
      navigate(getSafeReturnPath(searchParams.get("from"), journeyKey), {
        replace: true,
      });
    } catch (authError) {
      setError(authError.message || "Unable to sign in. Check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe6] px-4 py-8 text-[#2a1b12] sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-[#d5c8b8] bg-[#fffdf8] shadow-[0_24px_80px_rgba(42,27,18,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden bg-[#4A2A08] p-10 text-[#fffdf8] lg:flex lg:flex-col lg:justify-between">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d9b77c]/60 font-display text-2xl font-black text-[#f1d6a5]">
                  ን
                </span>
                <span>
                  <span className="block font-display text-2xl font-black tracking-tight">ንቐደም</span>
                  <span className="block font-sans text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[#e7d5bd]">Independent journalism</span>
                </span>
              </Link>
              <div className="mt-24 max-w-md">
                <p className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-[#e0bb7f]">Member access</p>
                <h1 className="mt-4 font-display text-5xl font-black leading-[0.98]">Return to your newsroom.</h1>
                <p className="mt-6 max-w-sm font-body text-base leading-7 text-[#eadfce]">Sign in to continue reading, manage deliveries, coordinate company orders, or operate the newsroom.</p>
              </div>
            </div>
            <div className="border-t border-[#d9b77c]/30 pt-6 font-sans text-xs uppercase tracking-[0.18em] text-[#e7d5bd]">Independent Journalism Since 2024</div>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link to="/" className="font-display text-2xl font-black text-[#4A2A08] lg:hidden">ንቐደም</Link>
                <p className="mt-6 font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-[#8b5f32] lg:mt-0">{journey.eyebrow}</p>
                <h2 className="mt-2 font-display text-3xl font-black tracking-tight sm:text-4xl">Sign in</h2>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d5c8b8] bg-[#f4efe6] text-[#4A2A08]"><KeyRound className="h-5 w-5" /></div>
            </div>
            {pendingApproval ? <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 font-body text-sm text-amber-900">Your business licence was submitted. An administrator must approve it before you can sign in and place bulk orders.</div> : null}

            <div className="mt-8 grid gap-2 sm:grid-cols-3">
              {journeyOptions.map((option) => {
                const Icon = option.icon;
                const isActive = option.key === activeOption.key;
                return (
                  <button key={option.key} type="button" onClick={() => selectJourney(option.key)} className={`flex min-h-16 w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-colors ${isActive ? "border-[#4A2A08] bg-[#4A2A08] text-white" : "border-[#d5c8b8] bg-white text-[#5f4c3d] hover:border-[#8b5f32]"}`}>
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="font-sans text-[0.68rem] font-bold uppercase leading-4 tracking-[0.08em]">{option.title}</span>
                  </button>
                );
              })}
            </div>

            <p className="mt-4 font-body text-sm leading-6 text-[#756253]">{journey.description}</p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
              {error ? <div role="alert" className="rounded-xl border border-[#c98d86] bg-[#fff3f1] px-4 py-3 text-sm leading-5 text-[#8b3027]">{error}</div> : null}

              <div>
                <label htmlFor="login-email" className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#4c392b]">Email address</label>
                <div className="flex w-full items-center rounded-xl border border-[#cfc0af] bg-white transition-colors focus-within:border-[#4A2A08] focus-within:ring-2 focus-within:ring-[#4A2A08]/15">
                  <Mail className="ml-4 h-4 w-4 shrink-0 text-[#8b5f32]" />
                  <input id="login-email" name="email" type="email" inputMode="email" autoComplete="username" autoCapitalize="none" spellCheck="false" value={form.email} onChange={updateField("email")} required placeholder={journeyKey === "business" ? "operations@nekedem.local" : "reader@nekedem.local"} className="min-h-14 w-full rounded-xl bg-transparent px-3 text-base text-[#2a1b12] outline-none placeholder:text-[#9b8c7d]" />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.18em] text-[#4c392b]">Password</label>
                <div className="flex w-full items-center rounded-xl border border-[#cfc0af] bg-white transition-colors focus-within:border-[#4A2A08] focus-within:ring-2 focus-within:ring-[#4A2A08]/15">
                  <Lock className="ml-4 h-4 w-4 shrink-0 text-[#8b5f32]" />
                  <input id="login-password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={updateField("password")} required placeholder="Enter your password" className="min-h-14 w-full rounded-xl bg-transparent px-3 text-base text-[#2a1b12] outline-none placeholder:text-[#9b8c7d]" />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-[#756253]"><input type="checkbox" checked={rememberMe} onChange={(event) => setRememberMe(event.currentTarget.checked)} className="h-4 w-4 accent-[#4A2A08]" />Keep me signed in</label>
                <Link to={`/forgot-password?journey=${journeyKey}`} className="text-xs font-bold uppercase tracking-[0.12em] text-[#4A2A08] hover:underline">Forgot password</Link>
              </div>

              <button type="submit" disabled={isSubmitting} className="flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4A2A08] px-6 font-sans text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#2a1b12] disabled:cursor-not-allowed disabled:opacity-60">{isSubmitting ? "Signing in..." : "Sign in"}{!isSubmitting ? <ArrowRight className="h-4 w-4" /> : null}</button>
            </form>

            <div className="mt-8 grid gap-2 rounded-xl border border-[#e2d7ca] bg-[#faf6ef] p-4 text-sm text-[#756253]"><p className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#4A2A08]"><CheckCircle2 className="h-4 w-4" />Demo access</p><p>Reader, company, and admin demo credentials are available in the project handoff notes.</p></div>

            <p className="mt-6 text-center text-sm text-[#756253]">{journeyKey === "admin" ? "Admin accounts are provisioned for internal operators." : <>Don&apos;t have an account? <Link to={`/register?journey=${journeyKey}`} className="font-bold text-[#4A2A08] hover:underline">Create one</Link></>}</p>
          </section>
        </div>
      </div>
    </main>
  );
}
