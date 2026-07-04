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
} from "@/lib/demoData";

const allArticles = [
  heroArticle,
  ...sidebarArticles,
  ...latestNews,
  ...editorials,
  featuredStory,
];

export default function ArticleDetail() {
  const { id } = useParams();
  const article = allArticles.find((a) => a.id === id) || heroArticle;
  const related = latestNews.filter((a) => a.id !== id).slice(0, 3);

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main>
        {/* Article Header */}
        <div className="max-w-4xl mx-auto px-4 pt-8">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 meta-text hover:text-heritage transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>

          <span className="category-label">{article.category}</span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-black text-ink leading-tight mt-2">
            {article.headline}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-4 pb-4 border-b border-stone-300/50">
            {article.author && (
              <span className="font-sans text-sm font-semibold text-ink">
                {article.author}
              </span>
            )}
            <span className="meta-text">{article.date}</span>
            {article.readTime && (
              <span className="flex items-center gap-1 meta-text">
                <Clock className="w-3 h-3" /> {article.readTime}
              </span>
            )}
            <div className="flex-1" />
            <button
              className="p-2 hover:text-heritage transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              className="p-2 hover:text-heritage transition-colors"
              aria-label="Bookmark"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Image */}
        {article.image && (
          <div className="max-w-5xl mx-auto px-4 mt-6">
            <img
              src={article.image}
              alt={article.headline}
              className="w-full aspect-[16/9] object-cover editorial-image"
            />
            <p className="meta-text mt-2 italic">
              Photo: ንቐደም / Staff Photographer
            </p>
          </div>
        )}

        {/* Article Body */}
        <article className="max-w-3xl mx-auto px-4 py-8">
          <div className="font-body text-lg text-ink leading-[1.8] space-y-6">
            <p className="drop-cap">
              {article.summary ||
                "In a world where the pace of change continues to accelerate, the events of this week remind us that careful analysis and rigorous reporting remain more important than ever."}
            </p>
            <p>
              The implications of this development extend far beyond the
              immediate sector. Economists and policy analysts have been closely
              watching the situation unfold, noting that the ramifications could
              reshape entire industries and influence policy decisions for years
              to come.
            </p>
            <p>
              "We are witnessing a fundamental shift in how institutions
              approach these challenges," said Dr. Helena Marchand, a senior
              fellow at the Institute for Global Policy. "The old frameworks
              simply don't apply anymore, and leaders at every level are being
              forced to adapt."
            </p>
            <p>
              The data supports this assessment. According to recent figures
              published by the International Bureau of Economic Research, the
              trend has been accelerating steadily over the past eighteen
              months, with no indication of slowing. Markets have responded with
              a mixture of cautious optimism and calculated repositioning.
            </p>
            <h3 className="font-display text-2xl font-bold text-ink mt-8 mb-4">
              A Turning Point for Global Governance
            </h3>
            <p>
              For decades, the prevailing consensus held that incremental reform
              would suffice. That consensus has been shattered. The events of
              the past quarter have demonstrated, with uncomfortable clarity,
              that more ambitious action is required — and that the window for
              such action is narrowing.
            </p>
            <p>
              Industry leaders interviewed by ንቐደም expressed both urgency and
              resolve. "This isn't about politics," noted Catherine Reyes, CEO
              of Meridian Holdings. "It's about building systems that work for
              the next generation, not just the next quarter."
            </p>
            <p>
              As the international community prepares for the next round of
              negotiations, the stakes could not be higher. The decisions made
              in the coming months will determine whether the momentum of this
              moment translates into lasting structural change — or dissipates
              into the familiar pattern of ambition without follow-through.
            </p>
            <p className="italic text-redacted">
              This story is developing. Check back for updates throughout the
              day, or subscribe to ንቐደም for real-time breaking news alerts.
            </p>
          </div>
        </article>

        {/* Related Articles */}
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="newspaper-rule-double mb-6" />
          <h2 className="font-display text-2xl font-black text-ink uppercase mb-6">
            Related Stories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-0 lg:divide-x lg:divide-stone-300/50">
            {related.map((a) => (
              <div key={a.id} className="lg:px-5 first:lg:pl-0 last:lg:pr-0">
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
