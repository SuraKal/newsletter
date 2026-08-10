import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";

export default function NewsCard({ article, variant = "default" }) {
  const { id, image, category, date, headline, summary, author } = article;
  const { t } = useLanguage();

  if (variant === "compact") {
    return (
      <Link to={`/article/${id}`} className="group block">
        <article className="hover-lift flex gap-4 rounded-[1rem] border border-stone-300/50 bg-paper p-4 shadow-[0_10px_26px_rgba(0,0,0,0.04)]">
          <div className="min-w-0 flex-1">
            <span className="category-label">{t(category)}</span>
            <h4 className="mt-1 font-heading text-sm font-bold leading-snug text-ink transition-colors group-hover:text-heritage">
              {t(headline)}
            </h4>
            <p className="meta-text mt-1">{t(date)}</p>
          </div>
          {image && (
            <img
              src={image}
              alt={t(headline)}
              className="h-14 w-14 flex-shrink-0 rounded-[0.75rem] object-cover editorial-image sm:h-16 sm:w-16"
            />
          )}
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/article/${id}`} className="group block">
      <article className="hover-lift rounded-[1.25rem] border border-stone-300/60 bg-paper p-5 shadow-[0_14px_34px_rgba(0,0,0,0.05)]">
        {image && (
          <div className="mb-4 overflow-hidden rounded-[0.9rem]">
            <img
              src={image}
              alt={headline}
              className="aspect-[4/3] w-full object-cover editorial-image transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <span className="category-label">{t(category)}</span>
        <h3 className="mt-2 font-heading text-lg font-bold leading-tight text-ink transition-colors group-hover:text-heritage md:text-xl">
          {t(headline)}
        </h3>
        {summary && (
          <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-redacted">
            {t(summary)}
          </p>
        )}
        <div className="mt-4 flex items-center gap-2 border-t border-stone-300/40 pt-3">
          <span className="meta-text">{t(date)}</span>
          {author && (
            <>
              <span className="meta-text">Â·</span>
              <span className="meta-text">{t(category)}</span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
