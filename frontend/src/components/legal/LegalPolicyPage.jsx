import React from "react";
import { Link } from "react-router-dom";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

export default function LegalPolicyPage({ page }) {
  if (!page) {
    return (
      <div className="min-h-screen bg-paper">
        <Masthead />
        <main>
          <section className="mx-auto max-w-5xl px-4 py-14">
            <span className="category-label">Policy</span>
            <h1 className="mt-3 font-display text-4xl font-black leading-tight text-ink md:text-5xl">
              This policy is not available.
            </h1>
            <div className="mt-6">
              <Link
                to="/"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-heritage px-6 font-sans text-xs font-bold uppercase tracking-[0.22em] text-paper transition-colors hover:bg-ink"
              >
                Back to the front page
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        <section className="mx-auto max-w-5xl px-4 py-14">
          <span className="category-label">{page.eyebrow || "Policy"}</span>
          <h1 className="mt-3 font-display text-4xl font-black leading-tight text-ink md:text-5xl">
            {page.title}
          </h1>
          {page.intro ? (
            <p className="mt-5 max-w-3xl font-body text-base leading-7 text-redacted">
              {page.intro}
            </p>
          ) : null}
          {page.lastUpdated ? (
            <p className="meta-text mt-4">Last updated: {page.lastUpdated}</p>
          ) : null}
        </section>

        {page.sections.length ? (
          <section className="mx-auto max-w-7xl px-4 pb-14">
            <div className="grid gap-5 lg:grid-cols-2">
              {page.sections.map((item, index) => (
                <article
                  key={`${item.heading || "section"}-${index}`}
                  className="rounded-[1.2rem] border border-stone-300/60 bg-vellum p-6 shadow-[0_12px_30px_rgba(0,0,0,0.04)]"
                >
                  <h2 className="font-heading text-xl font-bold text-ink">
                    {item.heading}
                  </h2>
                  <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {page.clauses.length ? (
          <section className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              {page.clauses.map((clause, index) => (
                <article
                  key={`${clause.heading || "clause"}-${index}`}
                  className="rounded-[1.2rem] border border-stone-300/50 bg-paper p-6 shadow-[0_12px_28px_rgba(0,0,0,0.04)]"
                >
                  {clause.heading ? (
                    <p className="category-label">{clause.heading}</p>
                  ) : null}
                  <ul className="mt-4 space-y-3">
                    {(clause.items || []).map((item, itemIndex) => (
                      <li key={itemIndex} className="flex gap-3">
                        <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-heritage" />
                        <p className="font-body text-sm leading-relaxed text-redacted">
                          {item}
                        </p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {page.contacts.length ? (
          <section className="mx-auto max-w-5xl px-4 py-10">
            <article className="rounded-[1.25rem] border border-stone-300/60 bg-paper p-7 shadow-[0_12px_28px_rgba(0,0,0,0.04)]">
              <p className="category-label">Contact</p>
              <div className="mt-4 space-y-2 font-sans text-sm text-ink">
                {page.contacts.map((contact, index) => (
                  <p key={`${contact.label}-${index}`}>
                    {contact.label}:{" "}
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-heritage hover:text-ink"
                    >
                      {contact.email}
                    </a>
                  </p>
                ))}
              </div>
            </article>
          </section>
        ) : null}
      </main>
      <Footer />
    </div>
  );
}