import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/lib/LanguageContext";

export default function SectionHeader({
  title,
  viewAllLink = null,
  viewAllText = "View All >",
  className = "",
  titleClassName = "",
  linkClassName = "",
  ruleClassName = "",
}) {
  const { t } = useLanguage();
  const displayTitle = t(title);
  const displayViewAllText = t(viewAllText);

  return (
    <div className={`mb-8 ${className}`.trim()}>
      <div className={`newspaper-rule-double mb-4 ${ruleClassName}`.trim()} />
      <div className="flex items-baseline justify-between">
        <h2
          className={`font-display text-3xl font-black uppercase tracking-tight text-ink md:text-4xl ${titleClassName}`.trim()}
        >
          {displayTitle}
        </h2>
        {viewAllLink && (
          <Link
            to={viewAllLink}
            className={`font-sans text-xs font-semibold uppercase tracking-wider text-heritage transition-colors hover:text-ink ${linkClassName}`.trim()}
          >
            {displayViewAllText}
          </Link>
        )}
      </div>
    </div>
  );
}
