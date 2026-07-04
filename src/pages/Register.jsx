import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { appClient } from "@/api/appClient";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { checkUserAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await appClient.auth.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      await checkUserAuth();
      navigate("/dashboard", { replace: true });
    } catch (registrationError) {
      setError(registrationError.message || "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="mx-auto max-w-md px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-black text-ink">
            Create Account
          </h1>
          <p className="mt-2 font-body text-sm text-redacted">
            Join ንቐደም and start reading today
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
              Full Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full border-b-2 border-stone-300 bg-transparent py-2.5 font-body text-sm text-ink outline-none focus:border-heritage"
            />
          </div>
          <div>
            <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full border-b-2 border-stone-300 bg-transparent py-2.5 font-body text-sm text-ink outline-none focus:border-heritage"
            />
          </div>
          <div>
            <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full border-b-2 border-stone-300 bg-transparent py-2.5 font-body text-sm text-ink outline-none focus:border-heritage"
            />
          </div>
          <div>
            <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
              Confirm Password
            </label>
            <input
              type="password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
              className="w-full border-b-2 border-stone-300 bg-transparent py-2.5 font-body text-sm text-ink outline-none focus:border-heritage"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-heritage py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-sans text-xs text-redacted">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-heritage hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
