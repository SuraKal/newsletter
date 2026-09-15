import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, LayoutTemplate } from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";
import {
  ArticleLayoutSwitcher,
  ArticleLayoutView,
  ArticleMoreFromSection,
} from "@/components/newspaper/ArticleTemplateView";
import { IMAGES } from "@/lib/constants";
import { getPublicListingArticles } from "@/lib/content-store";
import { getArticleAccessState } from "@/lib/demoData";
import { isValidArticleTemplate, getTemplateLabel } from "@/lib/article-templates";
import { useStoreVersion } from "@/lib/store-bus";

const previewArticle = {
  id: "template-preview",
  category: "Community",
  date: "September 15, 2026",
  headline: "The Front Page Reimagined: A Layout for Every Desk",
  summary:
    "Careful reporting deserves a fitting frame. This showcase walks every section through the six layouts used across the newsroom — from the quiet serifs of the printed edition to the bold brevity of the express desk.",
  author: "Newsroom Staff",
  readTime: "8 min read",
  image: IMAGES.hero,
  body: [
    "Editors choose a template per category so each desk carries its own visual voice. Features favour a long-form magazine spread, the news desk runs a strict broadsheet grid, while the express pages lean on heavy rules and fast-read typography.",
    "The dispatch layout is built for the morning inbox: a narrow type measure, a clear lead box, and a closing call to subscribe, all in one scannable column.",
    "Every template shares the same reporting standards and access rules. When a reader follows a story from one section to another, the layout follows the section — not the reader.",
  ],
};

export default function TemplatePreview() {
  useStoreVersion();
  const location = useLocation();

  const layoutParam = new URLSearchParams(location.search).get("layout");
  const layoutKey = isValidArticleTemplate(layoutParam) ? layoutParam : "classic";

  const isClassicLayout = layoutKey === "classic";
  const isNewspaperLayout = layoutKey === "newspaper";
  const isMagazineLayout = layoutKey === "magazine";
  const isTabloidLayout = layoutKey === "tabloid";
  const isNewsletterLayout = layoutKey === "newsletter";

  const layoutOptions = [
    { key: "feature", label: "Feature", path: "/templates?layout=feature" },
    { key: "classic", label: "Classic", path: "/templates?layout=classic" },
    { key: "newspaper", label: "Newspaper", path: "/templates?layout=newspaper" },
    { key: "magazine", label: "Magazine", path: "/templates?layout=magazine" },
    { key: "tabloid", label: "Tabloid", path: "/templates?layout=tabloid" },
    { key: "newsletter", label: "Newsletter", path: "/templates?layout=newsletter" },
  ];

  const related = getPublicListingArticles()
    .filter((item) => item.id !== previewArticle.id)
    .slice(0, 3);
  const access = getArticleAccessState(previewArticle, true);

  return (
    <div className={`min-h-screen bg-paper newspaper-page ${isClassicLayout ? "classic-article-page" : isNewspaperLayout ? "newspaper-article-page" : isMagazineLayout ? "magazine-article-page" : isTabloidLayout ? "tabloid-article-page" : isNewsletterLayout ? "newsletter-article-page" : ""}`}>
      <Masthead />
      <main>
        <section className="mx-auto max-w-[1320px] px-3 pt-4 sm:px-5 lg:px-8">
          <div className="newspaper-rule-double mb-4" />
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-stone-300/50 pb-4">
            <Link
              to="/news"
              className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-redacted transition-colors hover:text-heritage"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Newsroom
            </Link>
            <ArticleLayoutSwitcher layoutKey={layoutKey} options={layoutOptions} />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3 border border-stone-300/60 bg-vellum px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center bg-heritage text-paper">
              <LayoutTemplate className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="font-sans text-[0.62rem] font-black uppercase tracking-[0.24em] text-heritage">
                Template Preview — {getTemplateLabel(layoutKey)}
              </p>
              <p className="mt-0.5 font-body text-sm leading-snug text-redacted">
                Sample content shown in the {getTemplateLabel(layoutKey)} layout.
                Use the switcher above to compare every template, then pick one
                per section in the admin &gt; Article Templates page.
              </p>
            </div>
          </div>
        </section>

        <ArticleLayoutView
          article={previewArticle}
          access={access}
          related={related}
          layoutKey={layoutKey}
        />

        <ArticleMoreFromSection layoutKey={layoutKey} related={related} />
      </main>
      <Footer />
    </div>
  );
}