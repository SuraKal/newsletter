import React from "react";
import { Link, useParams } from "react-router-dom";
import { Share2, Bookmark, Clock, ArrowLeft } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import NewsCard from "@/components/newspaper/NewsCard";
import {
  heroArticle,
  latestNews,
  editorials,
  sidebarArticles,
  featuredStory,
  categoryArticles,
} from "@/lib/demoData";

const allArticles = [
  heroArticle,
  ...sidebarArticles,
  ...latestNews,
  ...editorials,
  featuredStory,
  ...Object.values(categoryArticles).flat(),
];

export default function ArticleDetail() {
  const { id } = useParams();
  const article = allArticles.find((a) => a.id === id) || heroArticle;
  const related = latestNews.filter((a) => a.id !== id).slice(0, 3);
  const articleBody = article.body || [];
  const comments = [
    {
      id: "c1",
      name: "Amina K.",
      time: "12 min ago",
      text: "This reads much more like a printed front-page analysis than a typical blog post.",
    },
    {
      id: "c2",
      name: "James W.",
      time: "38 min ago",
      text: "The extra context and the sidebar notes help a lot. Keep the newspaper feel going.",
    },
    {
      id: "c3",
      name: "Lina M.",
      time: "1 hour ago",
      text: "The pull quote and the column layout make the article feel more editorial and credible.",
    },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        <section className="mx-auto max-w-7xl px-4 pt-8">
          <div className="newspaper-rule-double mb-4" />
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-300/50 pb-4">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-redacted transition-colors hover:text-heritage"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Newsroom
            </Link>
            <div className="flex items-center gap-3">
              <button
                className="p-2 transition-colors hover:text-heritage"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                className="p-2 transition-colors hover:text-heritage"
                aria-label="Bookmark"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <article className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
          <div className="border-r border-stone-300/40 pr-0 lg:pr-8">
            <div className="max-w-4xl">
              <span className="category-label">{article.category}</span>
              <h1 className="mt-3 font-display text-4xl font-black leading-[1.05] text-ink md:text-5xl lg:text-6xl">
                {article.headline}
              </h1>
              <p className="mt-4 max-w-3xl border-l-4 border-heritage pl-4 font-body text-lg leading-relaxed text-redacted">
                {article.summary}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3 border-y border-stone-300/50 py-3">
                {article.author && (
                  <span className="font-sans text-sm font-semibold uppercase tracking-wider text-ink">
                    By {article.author}
                  </span>
                )}
                <span className="meta-text">{article.date}</span>
                {article.readTime && (
                  <span className="flex items-center gap-1 meta-text">
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                )}
              </div>
            </div>

            {article.image && (
              <figure className="mt-8">
                <img
                  src={article.image}
                  alt={article.headline}
                  className="w-full border border-stone-300/50 object-cover shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
                />
                <figcaption className="meta-text mt-2 italic">
                  Photo: {article.author || "Staff"} / Newspaper Desk
                </figcaption>
              </figure>
            )}

            <div className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-[1fr_minmax(220px,280px)]">
              <div className="font-body text-[1.05rem] leading-[1.95] text-ink">
                <p className="drop-cap">
                  {article.summary ||
                    "In a world where the pace of change continues to accelerate, careful reporting remains more important than ever."}
                </p>
                {(articleBody.length > 0
                  ? articleBody
                  : [
                      "The newsroom continues to track the story as officials, residents, and stakeholders respond to the latest developments.",
                      "Our correspondents are speaking with local voices and reviewing the full implications for families, businesses, and public services.",
                    ]
                ).map((paragraph) => (
                  <p key={paragraph} className="mt-6">
                    {paragraph}
                  </p>
                ))}
                <p className="mt-6 border-l-4 border-heritage bg-vellum px-4 py-3 font-display text-xl italic text-ink">
                  “The details matter, and the public deserves the full record.”
                </p>
                <p className="mt-6">
                  The article will continue to be updated as new information
                  becomes available, with editors placing emphasis on verified
                  sourcing and readable context rather than a generic blog
                  format.
                </p>

                <div className="mt-12 border-t-4 border-double border-stone-300/60 pt-8">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="font-display text-2xl font-black uppercase text-ink">
                      Reader Comments
                    </h2>
                    <span className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.22em] text-redacted">
                      {comments.length} Voices
                    </span>
                  </div>
                  <p className="mt-2 max-w-2xl font-body text-sm leading-relaxed text-redacted">
                    A short reader panel sits under every story so the page
                    feels like an active newsroom, not a generic article card.
                  </p>

                  <form className="mt-6 border border-stone-300/60 bg-vellum p-5">
                    <label className="font-sans text-xs font-bold uppercase tracking-wider text-ink">
                      Leave a Comment
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share your thoughts on this story..."
                      className="mt-3 w-full resize-none border border-stone-300/60 bg-paper p-3 font-body text-sm text-ink outline-none placeholder:text-redacted/60 focus:border-heritage"
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <p className="font-sans text-[0.7rem] uppercase tracking-[0.18em] text-redacted">
                        Please keep comments respectful and relevant.
                      </p>
                      <button
                        type="button"
                        className="bg-heritage px-5 py-3 font-sans text-xs font-bold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>

                  <div className="mt-6 space-y-4">
                    {comments.map((comment) => (
                      <article
                        key={comment.id}
                        className="border-b border-stone-300/50 pb-4 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                            {comment.name}
                          </h3>
                          <span className="meta-text">{comment.time}</span>
                        </div>
                        <p className="mt-2 font-body text-sm leading-relaxed text-redacted">
                          {comment.text}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              <aside className="border border-stone-300/60 bg-vellum p-5 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
                <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-ink">
                  In Brief
                </h2>
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="meta-text">Section</p>
                    <p className="font-semibold text-ink">{article.category}</p>
                  </div>
                  <div>
                    <p className="meta-text">Published</p>
                    <p className="font-semibold text-ink">{article.date}</p>
                  </div>
                  <div>
                    <p className="meta-text">Reporter</p>
                    <p className="font-semibold text-ink">
                      {article.author || "News Desk"}
                    </p>
                  </div>
                  <div>
                    <p className="meta-text">Reading Time</p>
                    <p className="font-semibold text-ink">
                      {article.readTime || "4 min read"}
                    </p>
                  </div>
                </div>
                <div className="mt-6 border-t border-stone-300/60 pt-4">
                  <p className="font-body text-sm leading-relaxed text-redacted">
                    This sidebar gives the story a more printed-paper feel and
                    keeps the page from reading like a standard card layout.
                  </p>
                </div>
              </aside>
            </div>
          </div>

          <aside className="lg:pl-2">
            <div className="sticky top-6 space-y-6">
              <div className="border border-stone-300/60 bg-paper p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)]">
                <h2 className="font-display text-2xl font-black text-ink">
                  Related Stories
                </h2>
                <div className="mt-5 grid grid-cols-1 gap-4">
                  {related.map((a) => (
                    <NewsCard key={a.id} article={a} />
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </article>

        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="newspaper-rule-double mb-6" />
          <h2 className="mb-6 font-display text-2xl font-black uppercase text-ink">
            More From The Paper
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
            {related.map((a) => (
              <div key={a.id} className="first:lg:pl-0 last:lg:pr-0 lg:px-5">
                <NewsCard article={a} />
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
