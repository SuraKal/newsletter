import React from "react";
import { useParams, Link } from "react-router-dom";
import PageWrapper from "@/components/nequdem/PageWrapper";
import { ARTICLES, IMAGES } from "@/lib/nequdem-data";
import NewsCard from "@/components/nequdem/NewsCard";
import { Share2, Bookmark, Facebook, Twitter } from "lucide-react";

export default function ArticleDetail() {
  const { id } = useParams();
  const article = ARTICLES.find((a) => a.id === id) || ARTICLES[0];
  const relatedArticles = ARTICLES.filter((a) => a.id !== article.id).slice(
    0,
    3,
  );
  const img = IMAGES[article.image] || IMAGES.hero;

  const bodyText =
    article.body ||
    `The implications of this development cannot be overstated. Industry analysts have been closely monitoring the situation for months, and the latest developments confirm what many had predicted — a fundamental shift in the landscape that will redefine expectations for years to come.

According to senior officials familiar with the matter, the decision was reached after extensive deliberation involving stakeholders from multiple sectors. The consensus, while not unanimous, reflects a growing recognition that traditional approaches are no longer sufficient to address the challenges at hand.

"We are at a pivotal moment," said Dr. Alexandra Reeves, a leading expert in the field. "The choices we make now will have consequences that extend far beyond our immediate concerns. This is about establishing a framework that can adapt to the realities of a rapidly changing world."

The response from international observers has been largely positive, though several prominent voices have urged caution. Economic forecasts suggest that the short-term adjustments will be significant, but the long-term benefits are expected to outweigh the initial disruption.

For the communities most directly affected, the announcement brings a mixture of relief and uncertainty. Local leaders have expressed cautious optimism while emphasizing the need for clear implementation guidelines and adequate support during the transition period.

As the situation continues to develop, Nequdem will provide comprehensive coverage and analysis. Our correspondents across six continents are tracking the story's implications for markets, governance, and civil society.`;

  return (
    <PageWrapper>
      <article className="nq-container py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground mb-8">
          <Link to="/" className="hover:text-heritage transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/news" className="hover:text-heritage transition-colors">
            News
          </Link>
          <span>/</span>
          <span className="text-heritage">{article.category}</span>
        </div>

        {/* Article header */}
        <div className="max-w-4xl">
          <span className="nq-category-label">{article.category}</span>
          <h1 className="nq-headline text-3xl md:text-5xl lg:text-[3.2rem] mt-4 leading-tight">
            {article.title}
          </h1>
          <p className="nq-deck mt-4 text-lg max-w-3xl">{article.deck}</p>
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm font-sans text-muted-foreground">
            <span className="font-semibold text-ink">By {article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
            <span>·</span>
            <span>{article.readTime}</span>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-3 mt-4">
            <button className="flex items-center gap-1 text-xs font-sans text-muted-foreground hover:text-heritage transition-colors p-2 border border-rule">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button className="flex items-center gap-1 text-xs font-sans text-muted-foreground hover:text-heritage transition-colors p-2 border border-rule">
              <Bookmark className="w-3.5 h-3.5" /> Save
            </button>
            <button className="p-2 border border-rule text-muted-foreground hover:text-heritage transition-colors">
              <Facebook className="w-3.5 h-3.5" />
            </button>
            <button className="p-2 border border-rule text-muted-foreground hover:text-heritage transition-colors">
              <Twitter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Hero image */}
        <div className="mt-8">
          <img
            src={img}
            alt={article.title}
            className="w-full h-64 md:h-[500px] object-cover"
          />
          <p className="font-sans text-xs text-muted-foreground mt-2 italic">
            Photo: Nequdem / Editorial Archive
          </p>
        </div>

        {/* Article body */}
        <div className="max-w-3xl mt-10">
          <div className="nq-drop-cap text-lg leading-[1.8] text-ink/90 space-y-6">
            {bodyText.split("\n\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Related articles */}
        <div className="mt-16">
          <div className="nq-hairline mb-8" />
          <h3 className="nq-section-title mb-8">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedArticles.map((a) => (
              <NewsCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      </article>
    </PageWrapper>
  );
}
