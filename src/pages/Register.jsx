import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Building2,
  Mail,
  MapPin,
  Newspaper,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import {
  authJourneyContent,
  getRoleFromJourney,
  useAuth,
} from "@/lib/AuthContext";
import { appClient } from "@/api/appClient";
import { getDefaultDashboardRoute } from "@/lib/dashboard-config";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

const journeyOptions = [
  { key: "individual", icon: Newspaper, title: "Individual reader" },
  { key: "business", icon: Building2, title: "Company account" },
];

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    companyName: "",
    contactPhone: "",
    deliveryAddress: "",
    consent: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { checkUserAuth } = useAuth();
  const journeyKey =
    searchParams.get("journey") === "business" ? "business" : "individual";
  const isBusinessJourney = journeyKey === "business";

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const selectJourney = (nextJourney) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("journey", nextJourney);
    setSearchParams(nextParams, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    if (!form.consent) {
      setError(
        "Please confirm how we can use your account and delivery information before continuing.",
      );
      return;
    }

    setLoading(true);

    try {
      const registeredUser = await appClient.auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: getRoleFromJourney(journeyKey),
        accountType: journeyKey,
        companyName: isBusinessJourney ? form.companyName : "",
        contactPhone: form.contactPhone,
        deliveryAddress: form.deliveryAddress,
      });
      await checkUserAuth();
      navigate(getDefaultDashboardRoute(registeredUser.role), {
        replace: true,
      });
    } catch (registrationError) {
      setError(registrationError.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(72,60,50,0.1),_transparent_62%)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:items-start lg:py-20">
          <section className="relative overflow-hidden rounded-[2rem] border border-stone-300/50 bg-vellum/70 p-8 shadow-[0_25px_80px_rgba(40,30,20,0.08)] lg:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-heritage/10 blur-3xl" />
            <div className="relative">
              <p className="category-label">Account setup</p>

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
                  {isBusinessJourney
                    ? "Business registration"
                    : "Reader registration"}
                </p>
                <h2 className="mt-2 font-display text-3xl font-black text-ink">
                  Create account
                </h2>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-stone-300/60 bg-vellum">
                {isBusinessJourney ? (
                  <Building2 className="h-6 w-6 text-heritage" />
                ) : (
                  <Newspaper className="h-6 w-6 text-heritage" />
                )}
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
                  {isBusinessJourney ? "Primary contact" : "Full name"}
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-300/70 bg-vellum/35 px-4 py-3 focus-within:border-heritage">
                  <UserRound className="h-4 w-4 text-redacted" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    required
                    placeholder={
                      isBusinessJourney
                        ? "Operations lead name"
                        : "Your full name"
                    }
                    className="w-full bg-transparent font-body text-sm text-ink outline-none placeholder:text-redacted/60"
                  />
                </div>
              </label>

              {isBusinessJourney ? (
                <label className="block">
                  <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink">
                    Company name
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-stone-300/70 bg-vellum/35 px-4 py-3 focus-within:border-heritage">
                    <Building2 className="h-4 w-4 text-redacted" />
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) =>
                        updateField("companyName", e.target.value)
                      }
                      required
                      placeholder="Company or organization"
                      className="w-full bg-transparent font-body text-sm text-ink outline-none placeholder:text-redacted/60"
                    />
                  </div>
                </label>
              ) : null}

              <label className="block">
                <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink">
                  Email
                </span>
                <div className="flex items-center gap-3 rounded-2xl border border-stone-300/70 bg-vellum/35 px-4 py-3 focus-within:border-heritage">
                  <Mail className="h-4 w-4 text-redacted" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    required
                    placeholder={
                      isBusinessJourney
                        ? "operations@company.com"
                        : "reader@example.com"
                    }
                    className="w-full bg-transparent font-body text-sm text-ink outline-none placeholder:text-redacted/60"
                  />
                </div>
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink">
                    Contact phone
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-stone-300/70 bg-vellum/35 px-4 py-3 focus-within:border-heritage">
                    <Phone className="h-4 w-4 text-redacted" />
                    <input
                      type="tel"
                      value={form.contactPhone}
                      onChange={(e) =>
                        updateField("contactPhone", e.target.value)
                      }
                      placeholder="+32 ..."
                      className="w-full bg-transparent font-body text-sm text-ink outline-none placeholder:text-redacted/60"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink">
                    Delivery context
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-stone-300/70 bg-vellum/35 px-4 py-3 focus-within:border-heritage">
                    <MapPin className="h-4 w-4 text-redacted" />
                    <input
                      type="text"
                      value={form.deliveryAddress}
                      onChange={(e) =>
                        updateField("deliveryAddress", e.target.value)
                      }
                      placeholder={
                        isBusinessJourney
                          ? "Primary office or first delivery site"
                          : "Home or delivery address"
                      }
                      className="w-full bg-transparent font-body text-sm text-ink outline-none placeholder:text-redacted/60"
                    />
                  </div>
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink">
                    Password
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-stone-300/70 bg-vellum/35 px-4 py-3 focus-within:border-heritage">
                    <ShieldCheck className="h-4 w-4 text-redacted" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      required
                      className="w-full bg-transparent font-body text-sm text-ink outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.22em] text-ink">
                    Confirm password
                  </span>
                  <div className="flex items-center gap-3 rounded-2xl border border-stone-300/70 bg-vellum/35 px-4 py-3 focus-within:border-heritage">
                    <ShieldCheck className="h-4 w-4 text-redacted" />
                    <input
                      type="password"
                      value={form.confirm}
                      onChange={(e) => updateField("confirm", e.target.value)}
                      required
                      className="w-full bg-transparent font-body text-sm text-ink outline-none"
                    />
                  </div>
                </label>
              </div>

              <label className="flex items-start gap-3 rounded-[1.25rem] border border-stone-300/50 bg-vellum/35 px-4 py-4">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => updateField("consent", e.target.checked)}
                  className="mt-1 accent-heritage"
                />
                <span className="font-body text-sm leading-6 text-ink">
                  I agree that my contact and delivery information can be used
                  for account setup, shipment routing, and account support, as
                  described in the privacy policy.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-heritage px-6 py-4 font-sans text-xs font-bold uppercase tracking-[0.24em] text-paper transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
              >
                <span>{loading ? "Creating Account..." : "Create Account"}</span>
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
              </button>
            </form>

            <div className="newspaper-rule my-8" />

            <div className="text-center">
              <p className="font-sans text-xs text-redacted">
                Already have an account?{" "}
                <Link
                  to={`/login?journey=${journeyKey}`}
                  className="font-semibold uppercase tracking-[0.16em] text-heritage hover:underline"
                >
                  Sign in
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
