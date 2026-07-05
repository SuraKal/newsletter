import React from "react";
import { Link } from "react-router-dom";
import { ARTICLES, TRENDING_HEADLINES, IMAGES } from "@/lib/nequdem-data";

export default function HeroSection() {
  const leadStory = ARTICLES[0];

  return (
    <section className="nq-container py-8">
      {/* Breaking news ribbon */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-heritage text-parchment text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1">
          Breaking
        </span>
        <p className="font-sans text-sm text-muted-foreground truncate">
          {leadStory.title}
        </p>
      </div>

      {/* Main hero grid — mimicking reference design */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Lead story — left 8 columns */}
        <div className="lg:col-span-8">
          <Link to={`/article/${leadStory.id}`} className="group block">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={IMAGES[leadStory.image]}
                alt={leadStory.title}
                className="w-full h-64 md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
            <div className="mt-4">
              <span className="nq-category-label">{leadStory.category}</span>
              <h2 className="nq-headline text-2xl md:text-4xl lg:text-[2.6rem] mt-3 leading-tight transition-all duration-200">
                {leadStory.title}
              </h2>
              <p className="nq-deck mt-3 max-w-2xl text-base">
                {leadStory.deck}
              </p>
              <div className="flex items-center gap-3 mt-4 text-xs font-sans text-muted-foreground">
                <span className="font-medium text-ink">
                  By {leadStory.author}
                </span>
                <span>·</span>
                <span>{leadStory.date}</span>
                <span>·</span>
                <span>{leadStory.readTime}</span>
              </div>
            </div>
          </Link>

          <div className="mt-6">
            <Link
              to={`/article/${leadStory.id}`}
              className="nq-btn-primary text-xs mr-3"
            >
              Read More
            </Link>
            <Link to="/subscriptions" className="nq-btn-outline text-xs">
              Subscribe Now
            </Link>
          </div>

          {/* Trending headlines below lead story */}
          <div className="nq-hairline mt-8 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              {TRENDING_HEADLINES.map((headline, i) => (
                <Link
                  to="/news"
                  key={i}
                  className="flex items-start gap-2 group"
                >
                  <span className="text-heritage font-sans text-xs font-bold mt-0.5">
                    ›
                  </span>
                  <span className="font-body text-sm text-ink group-hover:text-heritage transition-colors leading-snug">
                    {headline}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar — right 4 columns: Popular News */}
        <div className="lg:col-span-4 lg:border-l lg:border-rule lg:pl-8">
          <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-heritage mb-6">
            Popular News
          </h3>
          <div className="space-y-6">
            {ARTICLES.slice(1, 6).map((article, i) => (
              <Link
                to={`/article/${article.id}`}
                key={article.id}
                className="group flex gap-4 items-start"
              >
                {i === 0 && (
                  <div className="w-full">
                    <div className="overflow-hidden rounded-2xl">
                      <img
                        src={IMAGES[article.image]}
                        alt={article.title}
                        className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <span className="nq-category-label mt-2 block">
                      {article.category}
                    </span>
                    <h4 className="nq-headline text-base mt-1 transition-all duration-200">
                      {article.title}
                    </h4>
                    <span className="text-xs font-sans text-muted-foreground mt-1 block">
                      {article.date}
                    </span>
                  </div>
                )}
                {i > 0 && (
                  <>
                    <span className="text-3xl font-display font-bold text-rule flex-shrink-0 w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h4 className="nq-headline text-sm transition-all duration-200 leading-snug">
                        {article.title}
                      </h4>
                      <span className="text-[11px] font-sans text-muted-foreground mt-1 block">
                        {article.date}
                      </span>
                    </div>
                  </>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
