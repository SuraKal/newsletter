import React, { useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="nq-container py-16">
      <div className="max-w-2xl mx-auto text-center">
        <Mail className="w-8 h-8 text-heritage mx-auto mb-4" />
        <h2 className="nq-section-title">The Morning Briefing</h2>
        <p className="nq-deck mt-3 text-base">
          Start every day informed. Our editors curate the most important
          stories and deliver them directly to your inbox before 7 AM.
        </p>
        {submitted ? (
          <div className="mt-8 p-6 nq-vellum border border-rule rounded-2xl">
            <p className="font-sans text-sm text-heritage font-semibold">
              Thank you for subscribing. Your first briefing arrives tomorrow
              morning.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 px-4 py-3 border border-rule bg-parchment font-sans text-sm rounded-full focus:outline-none focus:border-heritage transition-colors"
            />
            <button
              type="submit"
              className="nq-btn-primary text-xs whitespace-nowrap"
            >
              Subscribe Free
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
