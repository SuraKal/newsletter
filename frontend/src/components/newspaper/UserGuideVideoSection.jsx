import React from "react";

export default function UserGuideVideoSection() {
  return (
    <section className="bg-paper py-16">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)] lg:items-end">
          <div className="max-w-3xl">
            <span className="font-sans text-[0.6rem] font-bold uppercase tracking-[0.24em] text-heritage">
              User Guide
            </span>
            <h2 className="mt-2 font-display text-3xl font-black leading-tight text-ink md:text-4xl lg:text-5xl">
              A polished walkthrough for new readers
            </h2>
            <p className="mt-3 font-body text-base leading-relaxed text-redacted">
              Watch a concise guide that shows how the paper works, where to
              find key sections, and how readers can move from headlines to
              subscriptions or business information.
            </p>
          </div>

          <div className="border-l border-stone-300/50 pl-0 lg:pl-6">
            <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink">
              Featured Playback
            </p>
            <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
              Kept intentionally short and clear so the section feels like an
              editorial explainer, not a generic embedded video.
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-hidden border border-stone-300/60 bg-vellum shadow-[0_18px_45px_rgba(0,0,0,0.08)]">
          <div className="flex items-center justify-between border-b border-stone-300/60 bg-paper px-4 py-3">
            <div>
              <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.2em] text-heritage">
                YouTube Guide
              </p>
              <p className="mt-1 font-body text-sm text-redacted">
                Quick overview for readers and partners
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-2.5 w-2.5 rounded-full bg-heritage" />
              <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.18em] text-redacted">
                HD
              </span>
            </div>
          </div>
          <div className="relative aspect-video w-full bg-ink">
            <iframe
              src="https://www.youtube.com/embed/maxhtw0ncsc"
              title="User guide video"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
