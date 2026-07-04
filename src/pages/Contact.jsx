import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="newspaper-rule-double mb-6" />
        <h1 className="font-display text-3xl md:text-4xl font-black text-ink uppercase">
          Contact
        </h1>
        <p className="font-body text-base text-redacted mt-2 mb-10">
          We'd love to hear from you. Reach out to our editorial or business
          team.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="border border-heritage/20 bg-vellum p-8 text-center">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Thank You
                </h2>
                <p className="font-body text-base text-redacted mt-2">
                  We've received your message and will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full bg-transparent border-b-2 border-stone-300 py-2 font-body text-sm text-ink focus:border-heritage outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full bg-transparent border-b-2 border-stone-300 py-2 font-body text-sm text-ink focus:border-heritage outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                    Subject
                  </label>
                  <select className="w-full bg-transparent border-b-2 border-stone-300 py-2 font-body text-sm text-ink focus:border-heritage outline-none">
                    <option>General Inquiry</option>
                    <option>Subscription Support</option>
                    <option>Business Partnership</option>
                    <option>Editorial Feedback</option>
                    <option>Delivery Issue</option>
                    <option>Press & Media</option>
                  </select>
                </div>
                <div>
                  <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    required
                    className="w-full bg-transparent border-2 border-stone-300 p-3 font-body text-sm text-ink focus:border-heritage outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="font-sans text-xs font-bold tracking-wider uppercase bg-heritage text-paper px-8 py-3 hover:bg-ink transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-heritage" />
                <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink">
                  Address
                </h3>
              </div>
              <p className="font-body text-sm text-redacted leading-relaxed ml-8">
                ንቐደም Publishing
                <br />
                42 Fleet Street
                <br />
                London, EC4Y 1AU
                <br />
                United Kingdom
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-heritage" />
                <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink">
                  Email
                </h3>
              </div>
              <p className="font-body text-sm text-redacted ml-8">
                editorial@ንቐደም.com
                <br />
                subscriptions@ንቐደም.com
                <br />
                business@ንቐደም.com
              </p>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Phone className="w-5 h-5 text-heritage" />
                <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink">
                  Phone
                </h3>
              </div>
              <p className="font-body text-sm text-redacted ml-8">
                +44 (0) 20 7946 0958
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
