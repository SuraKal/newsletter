import React, { useState } from "react";
import { Mail } from "lucide-react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <Mail className="w-8 h-8 text-heritage mx-auto mb-4" />
        <h2 className="font-display text-3xl md:text-4xl font-black text-ink">
          The Morning Briefing
        </h2>
        <p className="font-body text-base text-redacted mt-3 leading-relaxed">
          Start your day informed. Our curated morning newsletter delivers the
          most important headlines, analysis, and insights directly to your
          inbox - every weekday at 7:00 AM.
        </p>

        {submitted ? (
          <p className="font-body text-base text-heritage mt-6 font-medium">
            Thank you for subscribing. Your first briefing arrives tomorrow
            morning.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-3 max-w-lg mx-auto sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 bg-transparent border-b-2 border-stone-300 px-1 py-3 font-body text-sm text-ink placeholder:text-redacted/50 focus:border-heritage outline-none transition-colors"
            />
            <button
              type="submit"
              className="font-sans text-xs font-bold tracking-wider uppercase bg-heritage text-paper px-6 py-3 transition-colors hover:bg-ink"
            >
              Subscribe
            </button>
          </form>
        )}

        <p className="meta-text mt-4">
          No spam. Unsubscribe anytime. Read our privacy policy.
        </p>
      </div>
    </section>
  );
}
