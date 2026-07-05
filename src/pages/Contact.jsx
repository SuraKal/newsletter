import React, { useState } from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PageWrapper>
      <div className="nq-container py-16">
        <div className="max-w-3xl">
          <span className="nq-category-label">Contact</span>
          <h1 className="nq-headline text-3xl md:text-5xl mt-4">
            Get in Touch
          </h1>
          <p className="nq-deck mt-4 text-base">
            Whether you have a question about subscriptions, business
            partnerships, or editorial inquiries, our team is here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
          {/* Contact form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="p-8 nq-vellum border border-rule text-center">
                <h3 className="font-display text-xl font-bold text-ink">
                  Message Received
                </h3>
                <p className="font-sans text-sm text-muted-foreground mt-2">
                  Thank you for reaching out. A member of our team will respond
                  within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ink block mb-2">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 border border-rule bg-parchment font-sans text-sm focus:outline-none focus:border-heritage"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ink block mb-2">
                      Email
                    </label>
                    <input
                      required
                      type="email"
                      className="w-full px-4 py-3 border border-rule bg-parchment font-sans text-sm focus:outline-none focus:border-heritage"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ink block mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-3 border border-rule bg-parchment font-sans text-sm focus:outline-none focus:border-heritage">
                    <option>General Inquiry</option>
                    <option>Subscription Support</option>
                    <option>Business Partnership</option>
                    <option>Editorial</option>
                    <option>Delivery Issue</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-xs font-semibold uppercase tracking-wider text-ink block mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-rule bg-parchment font-sans text-sm focus:outline-none focus:border-heritage resize-none"
                  />
                </div>
                <button type="submit" className="nq-btn-primary text-xs">
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-8">
            {[
              {
                icon: MapPin,
                title: "Address",
                lines: [
                  "Nequdem Publishing Ltd.",
                  "14 Fleet Street",
                  "London EC4Y 1AU",
                  "United Kingdom",
                ],
              },
              {
                icon: Phone,
                title: "Telephone",
                lines: ["+44 (0)20 7936 1234"],
              },
              {
                icon: Mail,
                title: "Email",
                lines: ["editorial@nequdem.com", "subscriptions@nequdem.com"],
              },
              {
                icon: Clock,
                title: "Hours",
                lines: [
                  "Monday – Friday: 8:00 – 18:00",
                  "Saturday: 9:00 – 14:00",
                ],
              },
            ].map(({ icon: Icon, title, lines }) => (
              <div key={title} className="flex gap-4">
                <Icon className="w-5 h-5 text-heritage flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-sans text-sm font-semibold text-ink">
                    {title}
                  </h4>
                  {lines.map((line) => (
                    <p
                      key={line}
                      className="font-sans text-sm text-muted-foreground"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
