import React from "react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import { cn } from "@/lib/utils";

export default function AuthLayout({
  icon: Icon,
  eyebrow = "Account access",
  title,
  subtitle,
  panelTitle = null,
  panelSubtitle = null,
  aside = null,
  footer = null,
  panelClassName = "",
  contentClassName = "",
  children,
}) {
  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(circle_at_top,_rgba(72,60,50,0.1),_transparent_62%)]" />
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:py-20">
          <section className="relative overflow-hidden rounded-[2rem] border border-stone-300/50 bg-vellum/70 p-8 shadow-[0_25px_80px_rgba(40,30,20,0.08)] lg:p-10">
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-heritage/10 blur-3xl" />
            <div className="relative">
              <p className="category-label">{eyebrow}</p>
              <h1 className="mt-4 max-w-xl font-display text-4xl font-black leading-tight text-ink md:text-5xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-5 max-w-2xl font-body text-base leading-relaxed text-redacted md:text-lg">
                  {subtitle}
                </p>
              ) : null}
              {aside ? <div className="mt-8">{aside}</div> : null}
            </div>
          </section>

          <section
            className={cn(
              "rounded-[2rem] border border-stone-300/50 bg-paper p-6 shadow-[0_20px_70px_rgba(30,20,10,0.08)] sm:p-8",
              panelClassName,
            )}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                {panelTitle ? (
                  <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-heritage">
                    {panelTitle}
                  </p>
                ) : null}
                <h2 className="mt-2 font-display text-3xl font-black text-ink">
                  {title}
                </h2>
              </div>
              {Icon ? (
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-stone-300/60 bg-vellum">
                  <Icon className="h-6 w-6 text-heritage" aria-hidden="true" />
                </div>
              ) : null}
            </div>

            {panelSubtitle ? (
              <p className="mt-4 font-body text-sm leading-6 text-redacted">
                {panelSubtitle}
              </p>
            ) : null}

            <div className={cn("mt-8", contentClassName)}>{children}</div>

            {footer ? (
              <>
                <div className="newspaper-rule my-8" />
                <div className="text-center font-sans text-xs text-redacted">
                  {footer}
                </div>
              </>
            ) : null}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
