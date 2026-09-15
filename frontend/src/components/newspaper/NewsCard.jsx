import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { getArticleAccessState } from "@/lib/demoData";
import { hasActiveReaderSubscription } from "@/lib/reader-subscription";

const accessToneClassMap = {
  subscriber: "border-emerald-200 bg-emerald-50 text-emerald-700",
  public: "border-stone-300 bg-vellum text-ink",
  locked: "border-amber-200 bg-amber-50 text-amber-700",
};

export default function NewsCard({
  article,
  variant = "default",
  showAccessState = true,
}) {
  const { id, image, category, date, headline, summary, author } = article;
  const { t } = useLanguage();
  const { user } = useAuth();
  const access = getArticleAccessState(
    article,
    hasActiveReaderSubscription(user),
  );
  const accessToneClass =
    accessToneClassMap[access.key] || accessToneClassMap.public;

  if (variant === "compact") {
    return (
      <Link to={`/article/${id}`} className="group block">
        <article className="hover-lift flex gap-3 border-b border-stone-400/60 bg-transparent px-3 py-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="category-label">{t(category)}</span>
              {showAccessState ? (
                <span
                  className={`rounded-full border px-2 py-0.5 font-sans text-[0.58rem] font-bold uppercase tracking-[0.14em] ${accessToneClass}`}
                >
                  {access.shortLabel}
                </span>
              ) : null}
            </div>
            <h4 className="mt-1 font-heading text-sm font-bold leading-snug text-ink transition-colors group-hover:text-heritage">
              {t(headline)}
            </h4>
            <p className="meta-text mt-1">{t(date)}</p>
            {showAccessState ? (
              <p className="mt-2 font-body text-xs leading-relaxed text-redacted">
                {t(access.detail)}
              </p>
            ) : null}
          </div>
          {image && (
            <img
              src={image}
              alt={t(headline)}
              className="editorial-image h-14 w-14 flex-shrink-0 object-cover sm:h-16 sm:w-16"
            />
          )}
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/article/${id}`} className="group block">
      <article className="hover-lift border border-stone-400/60 bg-paper p-4">
        {image && (
          <div className="mb-4 overflow-hidden">
            <img
              src={image}
              alt={headline}
              className="editorial-image aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <span className="category-label">{t(category)}</span>
          {showAccessState ? (
            <span
              className={`rounded-full border px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.14em] ${accessToneClass}`}
            >
              {access.shortLabel}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 font-heading text-lg font-bold leading-tight text-ink transition-colors group-hover:text-heritage md:text-xl">
          {t(headline)}
        </h3>
        {summary ? (
          <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-redacted">
            {t(summary)}
          </p>
        ) : null}
        {showAccessState ? (
          <p className="mt-3 border-l-2 border-heritage bg-vellum/70 px-3 py-2 font-body text-xs leading-relaxed text-redacted">
            {t(access.detail)}
          </p>
        ) : null}
        <div className="mt-4 flex items-center gap-2 border-t border-stone-300/40 pt-3">
          <span className="meta-text">{t(date)}</span>
          {author ? (
            <>
              <span className="meta-text">·</span>
              <span className="meta-text">{t(category)}</span>
            </>
          ) : null}
        </div>
      </article>
    </Link>
  );
}
