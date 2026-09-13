import { appParams } from "@/lib/app-params";
import {
  adminEditorArticles,
  categoryArticles,
  editorials,
  featuredStory,
  heroArticle,
  latestNews,
  parseArticleDate,
  rightColumnArticle,
  sidebarArticles,
} from "@/lib/demoData";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const contentKey = `${appParams.storagePrefix}_content_articles`;

const byDateDesc = (a, b) => {
  const timeA = parseArticleDate(a.publishDate || a.date)?.getTime() || 0;
  const timeB = parseArticleDate(b.publishDate || b.date)?.getTime() || 0;
  return timeB - timeA;
};

function publishWindowFor(item) {
  if (item.publishWindow) return item.publishWindow;
  const parts = [item.publishDate, item.publishTime].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Awaiting editor sign-off";
}

function normalizeSeedArticle(item, source, extra = {}) {
  const bodyValue = Array.isArray(item.body)
    ? item.body.join("\n\n")
    : String(item.body || "");
  return {
    id: item.id,
    headline: item.headline || "",
    category: item.category || item.sector || "News",
    sector: item.sector || item.category || "News",
    image: item.image || null,
    date: item.date || "",
    summary: item.summary || "",
    author: item.author || "Editorial desk",
    readTime: item.readTime || null,
    accessLabel: item.accessLabel || null,
    publicAccessDate: item.publicAccessDate || null,
    body: bodyValue,
    status: item.status || "Published",
    tone: item.tone || "success",
    editor: item.editor || "Editorial desk",
    publishDate: item.publishDate || item.date || "",
    publishTime: item.publishTime || "",
    publishWindow: publishWindowFor(item),
    source: item.source || source || "admin",
    categoryKey: extra.categoryKey || item.categoryKey || null,
    councilSession: item.councilSession || "",
    eventDate: item.eventDate || "",
    location: item.location || "",
    scorelineFocus: item.scorelineFocus || "",
    marketImpact: item.marketImpact || "",
  };
}

function buildSeedArticles() {
  const seeded = [];
  seeded.push(normalizeSeedArticle(heroArticle, "hero"));
  seeded.push(normalizeSeedArticle(rightColumnArticle, "right"));
  seeded.push(normalizeSeedArticle(featuredStory, "featured"));
  sidebarArticles.forEach((article) => seeded.push(normalizeSeedArticle(article, "sidebar")));
  latestNews.forEach((article) => seeded.push(normalizeSeedArticle(article, "latest")));
  editorials.forEach((article) => seeded.push(normalizeSeedArticle(article, "editorial")));
  Object.entries(categoryArticles).forEach(([key, items]) => {
    items.forEach((article) =>
      seeded.push(normalizeSeedArticle(article, "category", { categoryKey: key }))
    );
  });
  adminEditorArticles.forEach((article) => seeded.push(normalizeSeedArticle(article, "admin")));

  const seen = new Set();
  return seeded.filter((article) => {
    if (seen.has(article.id)) return false;
    seen.add(article.id);
    return true;
  });
}

function readAll() {
  if (!storage) return buildSeedArticles();
  const raw = storage.getItem(contentKey);
  if (!raw) return buildSeedArticles();
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    // fall through to reseed
  }
  return buildSeedArticles();
}

function writeAll(articles) {
  if (storage) storage.setItem(contentKey, JSON.stringify(articles));
}

function toRenderArticle(article) {
  const bodyValue = Array.isArray(article.body)
    ? article.body.join("\n\n")
    : String(article.body || "");
  return {
    ...article,
    body: bodyValue.split("\n\n").filter(Boolean),
  };
}

function categoryKeyFor(category) {
  const key = String(category || "").toLowerCase();
  if (key.includes("news") || key.includes("politic")) return "news";
  if (key.includes("community")) return "community";
  if (key.includes("business") || key.includes("market")) return "business";
  if (key.includes("technology")) return "technology";
  if (key.includes("culture")) return "culture";
  if (key.includes("event")) return "events";
  return null;
}

export const ARTICLE_PLACEMENTS = [
  {
    value: "latest",
    label: "Latest news",
    note: "Rendered under the 'Latest News' grid on the home page and in the News lead secondary stories.",
  },
  {
    value: "hero",
    label: "Hero story",
    note: "Rendered as the first slide of the front-page 'Top stories carousel'. Only the first Published hero article shows.",
  },
  {
    value: "sidebar",
    label: "Sidebar rail",
    note: "Rendered in the 'News Desk — Stories worth keeping' rail below the front-page hero.",
  },
  {
    value: "featured",
    label: "Featured story",
    note: "Rendered in the 'Editor's Selection' banner on the home page. Only the first Published featured article shows.",
  },
  {
    value: "editorial",
    label: "Opinion & Analysis",
    note: "Rendered in the 'Opinion & Analysis' grid on the home page.",
  },
  {
    value: "admin",
    label: "General news listing",
    note: "Rendered in the 'All News' listing on the News page and the related-story rails.",
  },
];

export function getPlacementLabel(source) {
  const placement = ARTICLE_PLACEMENTS.find(
    (option) => option.value === source,
  );
  return placement ? placement.label : "General news listing";
}

export function getAllArticles() {
  return readAll()
    .filter((item) => item.status === "Published")
    .map(toRenderArticle);
}

export function getArticleById(id) {
  if (!id) return null;
  const article = readAll().find((item) => item.id === id);
  return article ? toRenderArticle(article) : null;
}

export function getRawArticleById(id) {
  if (!id) return null;
  return readAll().find((item) => item.id === id) || null;
}

export function getHeroArticle() {
  const hero = readAll().find(
    (item) => item.source === "hero" && item.status === "Published",
  );
  return toRenderArticle(hero || buildSeedArticles()[0]);
}

export function getRightColumnArticle() {
  const right = readAll().find(
    (item) => item.source === "right" && item.status === "Published",
  );
  return toRenderArticle(right || heroArticle);
}

export function getFeaturedStory() {
  const featured = readAll().find(
    (item) => item.source === "featured" && item.status === "Published",
  );
  return toRenderArticle(featured || featuredStory);
}

export function getSidebarArticles() {
  return readAll()
    .filter((item) => item.source === "sidebar" && item.status === "Published")
    .map(toRenderArticle);
}

export function getLatestNews() {
  return readAll()
    .filter((item) => item.source === "latest" && item.status === "Published")
    .sort(byDateDesc)
    .map(toRenderArticle);
}

export function getEditorials() {
  return readAll()
    .filter((item) => item.source === "editorial" && item.status === "Published")
    .map(toRenderArticle);
}

export function getCategoryArticles() {
  const groups = {};
  readAll().forEach((article) => {
    const key = article.categoryKey || categoryKeyFor(article.category || article.sector);
    if (!key || article.status !== "Published") return;
    (groups[key] = groups[key] || []).push(toRenderArticle(article));
  });
  Object.keys(groups).forEach((key) => groups[key].sort(byDateDesc));
  return groups;
}

export function getPublicListingArticles() {
  const featuredIds = new Set(["featured", "hero", "right"]);
  return readAll()
    .filter((article) => !featuredIds.has(article.source) && article.status === "Published")
    .sort(byDateDesc)
    .map(toRenderArticle);
}

export function saveArticle(article) {
  const all = readAll();
  const rawId = article.id && article.id !== "new" ? article.id : `art-${Date.now()}`;
  const record = normalizeSeedArticle({ ...article, id: rawId, body: article.body }, "admin");
  const index = all.findIndex((item) => item.id === rawId);
  if (index >= 0) {
    all[index] = record;
  } else {
    all.push(record);
  }
  writeAll(all);
  return record;
}

export function deleteArticle(id) {
  writeAll(readAll().filter((item) => item.id !== id));
}

export function resetContentStore() {
  if (storage) storage.removeItem(contentKey);
}

export function getAdminContentRows() {
  return readAll()
    .sort(byDateDesc)
    .map((article) => ({
      id: article.id,
      headline: article.headline,
      sector: article.sector || article.category || "News",
      editor: article.editor,
      status: article.status,
      tone: article.tone,
      publishWindow: article.publishWindow || publishWindowFor(article),
      image: article.image || null,
      category: article.category || article.sector || "News",
      source: article.source || "admin",
    }));
}

function releaseLabelFor(article) {
  if (article.status === "Published") return "Live in newsroom";
  if (article.status === "Scheduled") return "Subscriber release";
  return `Awaiting ${article.editor} sign-off`;
}

function byPublishSlot(a, b) {
  const timeA = parseArticleDate(a.publishDate || a.date)?.getTime() || 0;
  const timeB = parseArticleDate(b.publishDate || b.date)?.getTime() || 0;
  if (timeA !== timeB) return timeA - timeB;
  return (a.publishTime || "").localeCompare(b.publishTime || "");
}

export function getAdminScheduleRows() {
  return readAll()
    .filter((article) => article.publishDate || article.publishWindow)
    .sort(byPublishSlot)
    .map((article) => ({
      id: article.id,
      slot: article.publishWindow || publishWindowFor(article),
      sector: article.sector || article.category || "News",
      headline: article.headline,
      status: article.status,
      tone: article.tone,
      release: releaseLabelFor(article),
    }));
}