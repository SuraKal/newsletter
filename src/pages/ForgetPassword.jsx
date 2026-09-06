import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Mail, ArrowLeft, Building2, Newspaper, Loader2 } from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";
import { authJourneyContent } from "@/lib/AuthContext";

const recoveryJourneys = [
  {
    key: "individual",
    icon: Newspaper,
    title: "Reader account",
    copy: "Single-subscriber access with personal billing and one delivery destination.",
  },
  {
    key: "business",
    icon: Building2,
    title: "Company account",
    copy: "Shared operational access for bulk copies, invoices, and location-level delivery tracking.",
  },
];

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const journeyKey =
    searchParams.get("journey") === "business" ? "business" : "individual";
  const journey = authJourneyContent[journeyKey];

  const selectJourney = (nextJourney) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("journey", nextJourney);
    setSearchParams(nextParams, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await appClient.auth.resetPasswordRequest(email);
    } catch {
      // Always show success regardless.
    } finally {
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      icon={Mail}
      eyebrow="Password recovery"
      title="Reset password"
      subtitle="Recover access through the same entry path your account uses every day."
      panelTitle={
        journeyKey === "business" ? "Business recovery" : "Reader recovery"
      }
      panelSubtitle={
        journeyKey === "business"
          ? "Use the company account email that manages invoicing, locations, or shipment visibility."
          : "Use the personal subscriber email connected to your reading access and delivery history."
      }
      aside={
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2">
            {recoveryJourneys.map((option) => {
              const OptionIcon = option.icon;
              const isActive = option.key === journeyKey;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => selectJourney(option.key)}
                  className={`rounded-[1.4rem] border p-4 text-left transition ${
                    isActive
                      ? "border-heritage bg-paper shadow-[0_16px_38px_rgba(76,43,8,0.08)]"
                      : "border-stone-300/50 bg-paper/75 hover:border-stone-400"
                  }`}
                >
                  <OptionIcon className="h-5 w-5 text-heritage" />
                  <p className="mt-3 font-sans text-[0.68rem] font-bold uppercase tracking-[0.2em] text-heritage">
                    {option.title}
                  </p>
                  <p className="mt-2 font-body text-sm leading-6 text-ink">
                    {option.copy}
                  </p>
                </button>
              );
            })}
          </div>
          <div className="rounded-[1.5rem] border border-stone-300/50 bg-paper/80 p-5">
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-heritage">
              Journey focus
            </p>
            <p className="mt-3 font-body text-base leading-7 text-ink">
              {journey.description}
            </p>
          </div>
        </div>
      }
      footer={
        <Link
          to={`/login?journey=${journeyKey}`}
          className="font-medium text-heritage hover:underline"
        >
          <ArrowLeft className="mr-1 inline h-3 w-3" />
          Back to log in
        </Link>
      }
    >
      {sent ? (
        <div className="space-y-2 text-center">
          <p className="font-body text-sm text-ink">
            If an account exists with that email, a reset link will arrive
            shortly.
          </p>
          <p className="font-body text-sm text-redacted">
            {journeyKey === "business"
              ? "Use the company operator email tied to invoices and shared shipment oversight."
              : "Use the same personal subscriber email that unlocks your current reading and delivery access."}
          </p>
          <p className="font-sans text-xs text-redacted">
            Local demo mode: open{" "}
            <code>{`/reset-password?token=demo&journey=${journeyKey}`}</code>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                placeholder={
                  journeyKey === "business"
                    ? "operations@company.com"
                    : "reader@example.com"
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 pl-10"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="h-12 w-full font-medium"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send reset link"
            )}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
