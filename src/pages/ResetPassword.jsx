import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  AlertTriangle,
  Building2,
  Lock,
  Newspaper,
  Loader2,
} from "lucide-react";
import { appClient } from "@/api/appClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/components/AuthLayout";
import { authJourneyContent } from "@/lib/AuthContext";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token");
  const journeyKey =
    searchParams.get("journey") === "business" ? "business" : "individual";
  const journey = authJourneyContent[journeyKey];

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await appClient.auth.resetPassword({ resetToken, newPassword });
      window.location.href = `/login?journey=${journeyKey}`;
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <AuthLayout
        icon={AlertTriangle}
        eyebrow="Password recovery"
        title="Invalid reset link"
        subtitle="This password reset link is missing, expired, or no longer matches the selected account journey."
        panelTitle="Request another link"
        panelSubtitle="Start over from the recovery page so we can send you back through the correct account path."
        aside={
          <div className="rounded-[1.5rem] border border-stone-300/50 bg-paper/80 p-5">
            <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-heritage">
              Account path
            </p>
            <p className="mt-3 font-body text-base leading-7 text-ink">
              {journey.description}
            </p>
          </div>
        }
        footer={
          <Link
            to={`/forgot-password?journey=${journeyKey}`}
            className="font-medium text-heritage hover:underline"
          >
            Request a new link
          </Link>
        }
      >
        <p className="text-center text-sm text-foreground">
          The link you used appears to be incomplete. Please request a new
          password reset email.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={Lock}
      eyebrow="Secure account reset"
      title="New password"
      subtitle="Set a fresh password before returning to your account workspace."
      panelTitle={
        journeyKey === "business" ? "Business credentials" : "Reader credentials"
      }
      panelSubtitle={
        journeyKey === "business"
          ? "Choose a password for the company account used for invoices, shipments, and team-level delivery oversight."
          : "Choose a password for the personal account used for reading access, subscription history, and home delivery tracking."
      }
      aside={
        <div className="rounded-[1.5rem] border border-stone-300/50 bg-paper/80 p-5">
          <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.22em] text-heritage">
            Journey
          </p>
          <div className="mt-3 flex items-start gap-3">
            {journeyKey === "business" ? (
              <Building2 className="mt-1 h-5 w-5 text-heritage" />
            ) : (
              <Newspaper className="mt-1 h-5 w-5 text-heritage" />
            )}
            <div>
              <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-heritage">
                {journey.label}
              </p>
              <p className="mt-2 font-body text-sm leading-6 text-ink">
                {journey.description}
              </p>
            </div>
          </div>
        </div>
      }
      footer={
        <Link
          to={`/login?journey=${journeyKey}`}
          className="font-medium text-heritage hover:underline"
        >
          Return to sign in
        </Link>
      }
    >
      {error ? (
        <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              autoFocus
              placeholder="********"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-12 pl-10"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <div className="relative">
            <Lock
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="confirm"
              type="password"
              autoComplete="new-password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              Resetting...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
