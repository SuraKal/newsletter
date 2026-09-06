import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  KeyRound,
  Lock,
  Mail,
  Newspaper,
} from "lucide-react";
import { authJourneyContent, useAuth } from "@/lib/AuthContext";
import { appClient } from "@/api/appClient";
import { getDefaultDashboardRoute } from "@/lib/dashboard-config";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

const journeyOptions = [
  { key: "individual", icon: Newspaper, title: "Individual reader" },
  { key: "business", icon: Building2, title: "Company account" },
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

  const selectJourney = (nextJourney) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("journey", nextJourney);
    setSearchParams(nextParams, { replace: true });
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
                    </button>
                  );
                })}
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
