import React from "react";
import { Link } from "react-router-dom";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import NewsCard from "@/components/newspaper/NewsCard";
import SectionHeader from "@/components/newspaper/SectionHeader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "@/lib/AuthContext";
import { hasActiveReaderSubscription } from "@/lib/reader-subscription";
import { getHeroArticle, getPublicListingArticles } from "@/lib/content-store";
import { getArticleAccessState } from "@/lib/demoData";

const PAGE_SIZE = 6;

function getPageItems(currentPage, totalPages) {
  const items = [];
  const add = (page) => items.push({ page, ellipsis: false });

  add(1);
  if (currentPage > 3) {
    items.push({ page: -1, ellipsis: true });
  }
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);
  for (let page = start; page <= end; page += 1) {
    add(page);
  }
  if (currentPage < totalPages - 2) {
    items.push({ page: -2, ellipsis: true });
  }
  if (totalPages > 1) {
    add(totalPages);
  }
  return items;
}

export default function News() {
  const { user } = useAuth();
  const hasSubscriberAccess = hasActiveReaderSubscription(user);
  const heroArticle = getHeroArticle();
  const listedArticles = getPublicListingArticles();
  const heroAccess = getArticleAccessState(heroArticle, hasSubscriberAccess);
  const [currentPage, setCurrentPage] = React.useState(1);

  const totalPages = Math.ceil(listedArticles.length / PAGE_SIZE);
  const currentItems = listedArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const pageItems = getPageItems(currentPage, totalPages);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-paper newspaper-page">
      <Masthead />
      <main className="mx-auto max-w-[1320px] px-3 py-3 sm:px-5 lg:px-8">
        <div className="newspaper-sheet border border-stone-400/60 p-3 sm:p-5 lg:p-6">
          <SectionHeader title="All News" />

          <div className="grid grid-cols-1 gap-6 border-b border-stone-400/70 pb-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6">
            <div className="border-b border-stone-400/70 pb-5 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-6">
              <p className="category-label">News Desk</p>
              <h2 className="mt-2 font-display text-2xl font-black leading-tight text-ink">
                The stories shaping today’s edition
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-redacted">
                Follow the latest reporting across politics, business, sport, culture, and community life.
              </p>
              <Link to="/subscriptions" className="mt-5 inline-flex bg-heritage px-4 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-paper hover:bg-ink">
                Read with access
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.8fr)]">
            <Link to={`/article/${heroArticle.id}`} className="group">
              <img
                src={heroArticle.image}
                alt={heroArticle.headline}
                className="editorial-image w-full aspect-[16/9] object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </Link>
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="category-label">{heroArticle.category}</span>
                <span
                  className={`rounded-full border px-2.5 py-1 font-sans text-[0.6rem] font-bold uppercase tracking-[0.14em] ${
                    heroAccess.key === "locked"
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : heroAccess.key === "subscriber"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-stone-300 bg-vellum text-ink"
                  }`}
                >
                  {heroAccess.shortLabel}
                </span>
              </div>
              <Link to={`/article/${heroArticle.id}`} className="group">
                <h2 className="mt-2 font-display text-2xl font-black leading-tight text-ink transition-colors group-hover:text-heritage md:text-3xl">
                  {heroArticle.headline}
                </h2>
              </Link>
              <p className="mt-3 font-body text-base leading-relaxed text-redacted">
                {heroArticle.summary}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="meta-text font-semibold">By {heroArticle.author}</span>
                <span className="meta-text">·</span>
                <span className="meta-text">{heroArticle.date}</span>
              </div>
            </div>
            </div>
          </div>

          <div className="newspaper-rule mb-8 mt-10" />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
            {currentItems.map((article) => (
              <div
                key={article.id}
                className="mb-6 first:lg:pl-0 last:lg:pr-0 lg:px-5"
              >
                <NewsCard article={article} />
              </div>
            ))}
          </div>

          <div className="newspaper-rule my-8" />

          <Pagination className="mb-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#news"
                  className={currentPage === 1 ? "pointer-events-none opacity-40" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    goToPage(currentPage - 1);
                  }}
                />
              </PaginationItem>

              {pageItems.map((item) =>
                item.ellipsis ? (
                  <PaginationItem key={`ellipsis-${item.page}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item.page}>
                    <PaginationLink
                      href="#news"
                      isActive={item.page === currentPage}
                      onClick={(event) => {
                        event.preventDefault();
                        goToPage(item.page);
                      }}
                    >
                      {item.page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              <PaginationItem>
                <PaginationNext
                  href="#news"
                  className={currentPage === totalPages ? "pointer-events-none opacity-40" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    goToPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p className="text-center font-sans text-[0.65rem] font-bold uppercase tracking-[0.2em] text-redacted">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
