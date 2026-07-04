import React from "react";
import { Link } from "react-router-dom";

export default function NewsCard({ article, variant = "default" }) {
  const { id, image, category, date, headline, summary, author } = article;

  if (variant === "compact") {
    return (
      <Link to={`/article/${id}`} className="group block">
        <article className="flex gap-3 py-3 border-b border-stone-300/30">
          <div className="flex-1">
            <span className="category-label">{category}</span>
            <h4 className="font-heading text-sm font-bold text-ink leading-snug mt-1 group-hover:text-heritage transition-colors">
              {headline}
            </h4>
            <p className="meta-text mt-1">{date}</p>
          </div>
          {image && (
            <img
              src={image}
              alt={headline}
              className="w-16 h-16 object-cover editorial-image flex-shrink-0"
            />
          )}
        </article>
      </Link>
    );
  }

  return (
    <Link to={`/article/${id}`} className="group block">
      <article>
        {image && (
          <div className="overflow-hidden mb-3">
            <img
              src={image}
              alt={headline}
              className="w-full aspect-[4/3] object-cover editorial-image group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
        )}
        <span className="category-label">{category}</span>
        <h3 className="font-heading text-lg md:text-xl font-bold text-ink leading-tight mt-1.5 group-hover:text-heritage transition-colors">
          {headline}
        </h3>
        {summary && (
          <p className="font-body text-sm text-redacted mt-2 leading-relaxed line-clamp-3">
            {summary}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="meta-text">{date}</span>
          {author && (
            <>
              <span className="meta-text">·</span>
              <span className="meta-text">{category}</span>
            </>
          )}
        </div>
      </article>
    </Link>
  );
}
