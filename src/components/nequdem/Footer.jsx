import React from "react";
import { Link } from "react-router-dom";

const footerLinks = {
  "About Nequdem": [
    { label: "Our Story", to: "/about" },
    { label: "Editorial Standards", to: "/about" },
    { label: "Careers", to: "/about" },
    { label: "Press Room", to: "/about" },
  ],
  Categories: [
    { label: "Politics", to: "/categories?category=politics" },
    { label: "Business", to: "/categories?category=business" },
    { label: "Technology", to: "/categories?category=technology" },
    { label: "Culture", to: "/categories?category=culture" },
  ],
  Subscriptions: [
    { label: "Digital Access", to: "/subscriptions" },
    { label: "Print + Digital", to: "/subscriptions" },
    { label: "Business Plans", to: "/business" },
    { label: "Gift a Subscription", to: "/subscriptions" },
  ],
  Support: [
    { label: "Contact Us", to: "/contact" },
    { label: "Delivery Tracking", to: "/delivery" },
    { label: "FAQs", to: "/contact" },
    { label: "Manage Account", to: "/reader-dashboard" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-ink text-parchment/80">
      <div className="nq-container py-16">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link
            to="/"
            className="font-display text-4xl font-black text-parchment italic"
          >
            Nequdem
          </Link>
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-parchment/50 mt-2">
            The World's Most Distinguished Newspaper
          </p>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-sans text-xs uppercase tracking-widest text-parchment font-semibold mb-4">
                {title}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="font-sans text-sm text-parchment/60 hover:text-parchment transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-parchment/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-parchment/40">
            © 2026 Nequdem Publishing Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-6 font-sans text-xs text-parchment/40">
            <Link
              to="/about"
              className="hover:text-parchment/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/about"
              className="hover:text-parchment/70 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/about"
              className="hover:text-parchment/70 transition-colors"
            >
              Cookie Preferences
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
