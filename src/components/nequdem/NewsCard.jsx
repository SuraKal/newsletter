import React from "react";
import { Link } from "react-router-dom";
import { IMAGES } from "@/lib/nequdem-data";

export default function NewsCard({ article, size = "medium" }) {
  const img = IMAGES[article.image] || IMAGES.hero;

  if (size === "large") {
    return (
      <Link to={`/article/${article.id}`} className="group block">
        <div className="overflow-hidden rounded-2xl">
          <img
            src={img}
            alt={article.title}
            className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="mt-4">
          <span className="nq-category-label">{article.category}</span>
          <h3 className="nq-headline text-xl md:text-2xl mt-2 transition-all duration-200 cursor-pointer">
            {article.title}
          </h3>
          <p className="nq-deck mt-2">{article.deck}</p>
          <div className="flex items-center gap-3 mt-3 text-xs font-sans text-muted-foreground">
            <span>By {article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
          </div>
        </div>
      </Link>
    );
  }

  if (size === "small") {
    return (
      <Link
        to={`/article/${article.id}`}
        className="group flex gap-4 items-start"
      >
        <img
          src={img}
          alt={article.title}
          className="w-20 h-20 object-cover flex-shrink-0 rounded-xl transition-transform duration-500 group-hover:scale-105"
        />
        <div>
          <span className="nq-category-label text-[10px]">
            {article.category}
          </span>
          <h4 className="nq-headline text-sm mt-1 transition-all duration-200 cursor-pointer leading-snug">
            {article.title}
          </h4>
          <span className="text-[11px] font-sans text-muted-foreground mt-1 block">
            {article.date}
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/article/${article.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl">
        <img
          src={img}
          alt={article.title}
          className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-3">
        <span className="nq-category-label">{article.category}</span>
        <h3 className="nq-headline text-base md:text-lg mt-1.5 transition-all duration-200 cursor-pointer">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 mt-2 text-xs font-sans text-muted-foreground">
          <span>By {article.author}</span>
          <span>·</span>
          <span>{article.date}</span>
        </div>
      </div>
    </Link>
  );
}
