import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { appClient } from "@/api/appClient";
import { appParams } from "@/lib/app-params";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { checkUserAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await appClient.auth.login({ email, password, rememberMe });
      await checkUserAuth();
      navigate(searchParams.get("from") || "/dashboard", { replace: true });
    } catch (authError) {
      setError(authError.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="mx-auto max-w-md px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-black text-ink">Sign In</h1>
          <p className="mt-2 font-body text-sm text-redacted">
            Access your ንቐደም account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? (
            <div className="rounded border border-red-200 bg-red-50 px-3 py-2 font-sans text-xs text-red-700">
              {error}
            </div>
          ) : null}
          <div>
            <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-b-2 border-stone-300 bg-transparent py-2.5 font-body text-sm text-ink outline-none focus:border-heritage"
              placeholder="reader@email.com"
            />
          </div>
          <div>
            <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-b-2 border-stone-300 bg-transparent py-2.5 font-body text-sm text-ink outline-none focus:border-heritage"
              placeholder="********"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-heritage"
              />
              <span className="font-sans text-xs text-redacted">
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="font-sans text-xs text-heritage hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-heritage py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-sans text-xs text-redacted">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-heritage hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        <div className="newspaper-rule my-8" />

        <div className="space-y-2 text-center">
          <p className="font-body text-sm text-redacted">
            Demo reader: {appParams.readerEmail} / {appParams.readerPassword}
          </p>
          <p className="font-body text-sm text-redacted">
            Demo admin: {appParams.adminEmail} / {appParams.adminPassword}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
