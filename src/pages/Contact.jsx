import React, { useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import ScrollReveal from "@/components/newspaper/ScrollReveal";

const topics = [
  "General Inquiry",
  "Subscription Support",
  "Business Partnership",
  "Editorial Feedback",
  "Delivery Issue",
  "Press & Media",
];

const channels = [
  {
    icon: Mail,
    title: "Email Us",
    lines: [
      "editorial@ንቐደም.com",
      "subscriptions@ንቐደም.com",
      "business@ንቐደም.com",
    ],
  },
  {
    icon: Phone,
    title: "Call the Desk",
    lines: ["+44 (0) 20 7946 0958", "Mon–Fri, 9am – 6pm GMT"],
  },
  {
    icon: MapPin,
    title: "Visit Us",
    lines: [
      "ንቐደም Publishing",
      "42 Fleet Street",
      "London, EC4Y 1AU, United Kingdom",
    ],
  },
  {
    icon: Clock,
    title: "Response Time",
    lines: ["Editorial: within 24 hours", "Business: within one working day"],
  },
];

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [topic, setTopic] = useState(topics[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />

      {/* Hero */}
      <section className="relative overflow-hidden bg-night">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 18% 22%, rgba(196,151,114,0.16), transparent 38%), radial-gradient(circle at 82% 8%, rgba(196,151,114,0.10), transparent 34%), linear-gradient(150deg, #100E0B 0%, #1C1712 52%, #2A1F15 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(236,230,219,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(236,230,219,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-24">
          <ScrollReveal effect="rise">
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-cream/50">
              Contact the newsroom
            </span>
            <h1 className="mt-4 max-w-3xl font-display text-4xl font-black leading-tight text-cream md:text-5xl lg:text-6xl">
              Start a conversation with our editorial and business desks.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-cream/65 sm:text-lg">
              Whether you have a story tip, a question about your subscription,
              or an idea for a partnership, the right desk is one message away.
              Every enquiry is read by a person, not an automated queue.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="mailto:editorial@ንቐደም.com?subject=Editorial%20Enquiry"
                className="group inline-flex items-center justify-center gap-2 bg-cream px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-night transition-colors hover:bg-warmbeige"
              >
                Email the editorial desk
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="mailto:business@ንቐደም.com?subject=Business%20Inquiry"
                className="inline-flex items-center justify-center border-2 border-cream/70 px-6 py-3 font-sans text-xs font-bold uppercase tracking-wider text-cream transition-colors hover:border-cream hover:bg-cream hover:text-night"
              >
                Business partnerships
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Body */}
      <main className="mx-auto max-w-7xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.9fr)]">
          {/* Form */}
          <ScrollReveal effect="fade">
            <section className="border border-stone-300/70 bg-[#fffdf9] p-6 shadow-[0_24px_60px_-24px_rgba(76,43,8,0.22)] sm:p-10">
              {submitted ? (
                <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-heritage/10">
                    <CheckCircle2 className="h-8 w-8 text-heritage" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-black text-ink">
                    Message received
                  </h2>
                  <p className="mt-3 max-w-md font-body text-base leading-relaxed text-redacted">
                    Thank you for reaching out. A member of our team has been
                    notified and will respond within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-8 inline-flex items-center gap-2 border-b border-heritage pb-1 font-sans text-xs font-bold uppercase tracking-wider text-heritage transition-colors hover:text-ink"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <>
                  <div className="border-b border-stone-300/60 pb-6">
                    <span className="font-sans text-[0.6rem] font-bold uppercase tracking-widest text-heritage">
                      Message the desk
                    </span>
                    <h2 className="mt-2 font-display text-3xl font-black text-ink">
                      Tell us what you need
                    </h2>
                    <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                      Choose a topic, then share the details of your enquiry.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-8 space-y-8">
                    <div>
                      <span className="mb-3 block font-sans text-xs font-bold uppercase tracking-wider text-ink">
                        Topic
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {topics.map((item) => {
                          const isActive = topic === item;
                          return (
                            <button
                              key={item}
                              type="button"
                              onClick={() => setTopic(item)}
                              className={`border px-4 py-2 font-sans text-[0.7rem] font-bold uppercase tracking-wider transition-colors ${
                                isActive
                                  ? "border-heritage bg-heritage text-paper"
                                  : "border-stone-300 bg-transparent text-redacted hover:border-heritage hover:text-heritage"
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="contact-name"
                          className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink"
                        >
                          Name
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          required
                          autoComplete="name"
                          placeholder="Your full name"
                          className="w-full border-b-2 border-stone-300 bg-transparent py-2.5 font-body text-base text-ink placeholder:text-redacted/60 focus:border-heritage focus:outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="contact-email"
                          className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink"
                        >
                          Email
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          required
                          autoComplete="email"
                          placeholder="you@example.com"
                          className="w-full border-b-2 border-stone-300 bg-transparent py-2.5 font-body text-base text-ink placeholder:text-redacted/60 focus:border-heritage focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-message"
                        className="mb-2 block font-sans text-xs font-bold uppercase tracking-wider text-ink"
                      >
                        Message
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={6}
                        required
                        placeholder="Share as much detail as you feel comfortable with…"
                        className="w-full resize-none border-2 border-stone-300 bg-transparent p-4 font-body text-base text-ink placeholder:text-redacted/60 focus:border-heritage focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-4 border-t border-stone-300/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-sans text-[0.65rem] uppercase tracking-wider text-redacted">
                        <Clock className="mr-1.5 inline h-3.5 w-3.5" />
                        Typical response time: under 24 hours
                      </p>
                      <button
                        type="submit"
                        className="group inline-flex items-center justify-center gap-2 bg-heritage px-8 py-3.5 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
                      >
                        Send message
                        <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </section>
          </ScrollReveal>

          {/* Info */}
          <aside className="space-y-5">
            {channels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <ScrollReveal key={channel.title} effect="rise" delay={index * 40}>
                  <div className="flex items-start gap-4 border border-stone-300/70 bg-vellum p-5 transition-shadow hover:shadow-[0_16px_40px_-20px_rgba(76,43,8,0.2)]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-heritage/25 bg-paper">
                      <Icon className="h-5 w-5 text-heritage" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-sans text-[0.65rem] font-bold uppercase tracking-widest text-heritage">
                        {channel.title}
                      </h3>
                      {channel.lines.map((line) => (
                        <p
                          key={line}
                          className="mt-1 break-words font-body text-sm leading-relaxed text-ink first-of-type:mt-1.5"
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}

            <ScrollReveal effect="rise" delay={160}>
              <div className="overflow-hidden border border-stone-300/70 bg-vellum">
                <div className="px-5 pt-5">
                  <h3 className="font-sans text-[0.65rem] font-bold uppercase tracking-widest text-heritage">
                    Find Us
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                    Our offices sit a short walk from St Paul&apos;s on Fleet
                    Street.
                  </p>
                </div>
                <div className="mt-4 aspect-[4/3] w-full">
                  <iframe
                    title="Google Maps location"
                    src="https://www.google.com/maps?q=42%20Fleet%20Street%2C%20London%2C%20EC4Y%201AU&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            </ScrollReveal>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}