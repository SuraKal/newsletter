import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";

const footerSections = [
  {
    title: "News",
    links: [
      { label: "News", path: "/categories?cat=news" },
      { label: "Community", path: "/categories?cat=community" },
      { label: "Business", path: "/categories?cat=business" },
      { label: "Technology", path: "/categories?cat=technology" },
      { label: "Events", path: "/categories?cat=events" },
      { label: "Culture & Lifestyle", path: "/categories?cat=culture-and-lifestyle" },
    ],
  },
  {
    title: "Subscriptions",
    links: [
      { label: "Digital Access", path: "/subscriptions" },
      { label: "Print + Digital", path: "/subscriptions" },
      { label: "Business Plans", path: "/business" },
      { label: "Gift Subscription", path: "/subscriptions" },
      { label: "Student Discount", path: "/subscriptions" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About ንቐደም", path: "/about" },
      { label: "Our Team", path: "/about" },
      { label: "Careers", path: "/about" },
      { label: "Press Room", path: "/about" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Delivery Tracking", path: "/delivery" },
      { label: "Help Center", path: "/contact" },
      { label: "Manage Account", path: "/dashboard" },
      { label: "Privacy Policy", path: "/privacy" },
      { label: "Terms of Service", path: "/terms" },
    ],
  },
];

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-night text-cream/80">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="text-center mb-12">
          <Link
            to="/"
            className="font-display text-4xl md:text-5xl font-black text-cream tracking-tight"
          >
            ንቐደም
          </Link>
          <p className="font-sans text-xs tracking-widest uppercase text-cream/40 mt-2">
            {t("Independent Journalism Since 2024")}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-sans text-xs font-bold tracking-widest uppercase text-cream/60 mb-4">
                {t(section.title)}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="font-body text-sm text-cream/60 hover:text-cream transition-colors"
                    >
                      {t(link.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-cream/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-cream/40">
            © {new Date().getFullYear()} ንቐደም Publishing. {t("All rights reserved.")}
          </p>
          <div className="flex items-center gap-6">
            {["X", "LinkedIn", "Facebook", "Instagram"].map((social) => (
              <a
                key={social}
                href={`https://${social.toLowerCase()}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-cream/40 hover:text-cream transition-colors tracking-wider uppercase"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
