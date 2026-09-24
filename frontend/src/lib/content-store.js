import { appParams } from "@/lib/app-params";
import {
  adminEditorArticles,
  categoryArticles,
  editorials,
  featuredStory,
  formatArticleDate,
  heroArticle,
  latestNews,
  parseArticleDate,
  rightColumnArticle,
  sidebarArticles,
  toDisplayDate,
  toDisplayTime,
  toISODate,
  toISOTime,
} from "@/lib/demoData";
import { notifyStoreChange } from "@/lib/store-bus";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const contentKey = `${appParams.storagePrefix}_content_articles`;
const articlesSyncKey = `${appParams.storagePrefix}_articles_sync`;

const byDateDesc = (a, b) => {
  const timeA = parseArticleDate(a.publishDate || a.date)?.getTime() || 0;
  const timeB = parseArticleDate(b.publishDate || b.date)?.getTime() || 0;
  return timeB - timeA;
};

function publishWindowFor(item) {
  if (item.publishWindow) return item.publishWindow;
  const displayDate = toDisplayDate(item.publishDate || item.date);
  const displayTime = toDisplayTime(item.publishTime);
  const parts = [displayDate || item.publishDate, displayTime || item.publishTime].filter(Boolean);
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
    video: item.video || item.meta?.video || null,
    date: item.date || "",
    summary: item.summary || "",
    author: item.author || "Editorial desk",
    readTime: item.readTime || null,
    accessLabel: item.accessLabel || null,
    publicAccessDate: item.publicAccessDate || null,
    accessMode: item.accessMode || item.meta?.accessMode || "auto",
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
    clicks: Number(item.clicks) || 0,
    translations:
      item.translations && typeof item.translations === "object"
        ? item.translations
        : item.meta?.translations && typeof item.meta.translations === "object"
          ? item.meta.translations
          : {},
  };
}

function seedClicksFor(id) {
  const text = String(id || "");
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  const random = Math.abs(hash) % 100 / 100;
  return Math.round(24 + random * 340);
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
  }).map((article) => ({
    ...article,
    clicks: article.clicks || seedClicksFor(article.id),
  }));
}

function readAll() {
  if (!storage) return buildSeedArticles();
  const raw = storage.getItem(contentKey);
  if (!raw) {
    const seeded = buildSeedArticles();
    writeAll(seeded);
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    // fall through to reseed
  }
  const seeded = buildSeedArticles();
  writeAll(seeded);
  return seeded;
}

// Reads the backend-synced article cache (the "wired" read path). Returns null
// when the backend has never pushed a snapshot so consumers fall back to the
// seeded mock store instead.
function readSynced() {
  if (!storage) return null;
  const raw = storage.getItem(articlesSyncKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    // fall through to null
  }
  return null;
}

function writeSynced(articles) {
  if (storage) storage.setItem(articlesSyncKey, JSON.stringify(articles));
  notifyStoreChange();
}

// Maps a backend article (as produced by `backendArticles.list()` /
// `toAppArticle`) into the canonical store shape getters consume: a flat
// category/sector label, a publish window string, and template extras flattened
// out of the backend `meta` object.
export function toStoreArticle(article) {
  const category =
    article.categoryLabel || article.category || article.sector || "News";
  return {
    id: article.id,
    headline: article.headline || "",
    category,
    sector: article.sector || article.category || category,
    image: article.image || null,
    video: article.video || article.meta?.video || null,
    date: article.date || article.publishDate || "",
    summary: article.summary || "",
    author: article.author || "Editorial desk",
    readTime: article.readTime || null,
    accessLabel: article.accessLabel || null,
    publicAccessDate: article.publicAccessDate || article.meta?.publicAccessDate || null,
    accessMode: article.accessMode || article.meta?.accessMode || "auto",
    body: Array.isArray(article.body)
      ? article.body.join("\n\n")
      : String(article.body || ""),
    status: article.status || "Published",
    tone: article.tone || "neutral",
    editor: article.editor || "Editorial desk",
    publishDate: article.publishDate || article.date || "",
    publishTime: article.publishTime || "",
    publishWindow: publishWindowFor(article),
    source: article.source || "latest",
    categoryKey: categoryKeyFor(category),
    councilSession: article.meta?.councilSession || article.councilSession || "",
    eventDate: article.meta?.eventDate || article.eventDate || "",
    location: article.meta?.location || article.location || "",
    scorelineFocus: article.meta?.scorelineFocus || article.scorelineFocus || "",
    marketImpact: article.meta?.marketImpact || article.marketImpact || "",
    clicks: Number(article.clicks) || 0,
    translations:
      article.translations && typeof article.translations === "object"
        ? article.translations
        : article.meta?.translations && typeof article.meta.translations === "object"
          ? article.meta.translations
          : {},
  };
}

// Replaces the backend-synced article cache. This is the appClient sync sink:
// when the Flask backend is reachable its published articles become the source
// of truth for every public getter, while the seeded mock store is untouched
// and stays as the offline/boot fallback.
export function syncArticlesFromBackend(articles) {
  const rows = (Array.isArray(articles) ? articles : [])
    .map(toStoreArticle)
    .filter(Boolean);
  if (!rows.length) return;
  writeSynced(rows);
}

// Public read source: prefers the backend-synced snapshot when one exists and
// otherwise falls back to the seeded mock store.
function readPublic() {
  return readSynced() || readAll();
}

// Backend-only read source. Returns the raw synced snapshot (already stored in
// the canonical store shape) or an empty array when the backend has never
// pushed one. Consumers that must never render demo/seed content (e.g. the
// landing sliders) should use this instead of `readPublic`.
export function getSyncedArticles() {
  return readSynced() || [];
}

export function hasSyncedArticles() {
  const synced = readSynced();
  return Array.isArray(synced) && synced.length > 0;
}

function writeAll(articles) {
  if (storage) storage.setItem(contentKey, JSON.stringify(articles));
  notifyStoreChange();
}

export function toRenderArticle(article) {
  if (!article) return null;
  const bodyValue = Array.isArray(article.body)
    ? article.body.join("\n\n")
    : String(article.body || "");
  const category =
    article.category || article.categoryLabel || article.sector || "News";
  const categoryLabel =
    article.categoryLabel || article.category || article.sector || "News";
  const rawDate = article.date || article.publishDate || "";
  const date = toDisplayDate(rawDate) || rawDate;
  const rendered = {
    ...article,
    category,
    categoryLabel,
    date,
    body: bodyValue.split("\n\n").filter(Boolean),
  };
  rendered.article = rendered;
  return rendered;
}

// Dynamic editorial content is authored per language. English stays on the
// article's primary fields while Tigrinya lives in `meta.translations.ti` on
// the API and is flattened into `translations` in the local store. Empty
// translated fields deliberately fall back to their English counterpart.
export function getArticleForLanguage(article, language) {
  if (!article || language !== "ti") return article;
  const translation = article.translations?.ti || article.meta?.translations?.ti;
  if (!translation || typeof translation !== "object") return article;

  const localized = { ...article };
  [
    "headline",
    "summary",
    "body",
    "author",
    "readTime",
    "councilSession",
    "eventDate",
    "location",
    "scorelineFocus",
    "marketImpact",
  ].forEach((key) => {
    const value = translation[key];
    if (typeof value === "string" && value.trim()) {
      localized[key] = value;
    }
  });
  return localized;
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
  return readPublic()
    .filter((item) => item.status === "Published")
    .map(toRenderArticle);
}

// Backend-only published listing. Used by surfaces that should never fall back
// to demo/seed content (landing sliders, etc.).
export function getSyncedPublishedArticles() {
  return getSyncedArticles()
    .filter((item) => item.status === "Published")
    .map(toRenderArticle);
}

export function getArticleById(id) {
  if (!id) return null;
  const article =
    readPublic().find((item) => item.id === id) ||
    readAll().find((item) => item.id === id);
  return article ? toRenderArticle(article) : null;
}

export function getRawArticleById(id) {
  if (!id) return null;
  return readAll().find((item) => item.id === id) || null;
}

export function getHeroArticle() {
  const hero = readPublic().find(
    (item) => item.source === "hero" && item.status === "Published",
  );
  return toRenderArticle(hero || buildSeedArticles()[0]);
}

export function getRightColumnArticle() {
  const right = readPublic().find(
    (item) => item.source === "right" && item.status === "Published",
  );
  return toRenderArticle(right || heroArticle);
}

export function getFeaturedStory() {
  const featured = readPublic().find(
    (item) => item.source === "featured" && item.status === "Published",
  );
  return toRenderArticle(featured || featuredStory);
}

export function getSidebarArticles() {
  return readPublic()
    .filter((item) => item.source === "sidebar" && item.status === "Published")
    .map(toRenderArticle);
}

export function getLatestNews() {
  return readPublic()
    .filter((item) => item.source === "latest" && item.status === "Published")
    .sort(byDateDesc)
    .map(toRenderArticle);
}

export function getEditorials() {
  return readPublic()
    .filter((item) => item.source === "editorial" && item.status === "Published")
    .map(toRenderArticle);
}

export function getCategoryArticles(categoryLabels = null) {
  const groups = {};
  readPublic().forEach((article) => {
    let key;
    if (categoryLabels) {
      const match = categoryLabels.find(
        (label) =>
          label.toLowerCase() === (article.category || "").toLowerCase(),
      );
      key = match || "Other";
    } else {
      key =
        article.categoryKey ||
        categoryKeyFor(article.category || article.sector);
    }
    if (!key || article.status !== "Published") return;
    (groups[key] = groups[key] || []).push(toRenderArticle(article));
  });
  Object.keys(groups).forEach((key) => groups[key].sort(byDateDesc));
  return groups;
}

export function getPublicListingArticles() {
  const featuredIds = new Set(["featured", "hero", "right"]);
  return readPublic()
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

export function registerArticleClick(id) {
  if (!id) return;
  const synced = readSynced();
  const source = synced || readAll();
  const index = source.findIndex((item) => item.id === id);
  if (index < 0) return;
  source[index] = { ...source[index], clicks: (Number(source[index].clicks) || 0) + 1 };
  if (synced) writeSynced(source);
  else writeAll(source);
}

export function resetContentStore() {
  if (storage) {
    storage.removeItem(contentKey);
    storage.removeItem(articlesSyncKey);
  }
  notifyStoreChange();
}

export function getAdminContentRows() {
  return readPublic()
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
      clicks: Number(article.clicks) || 0,
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

export {
  parseArticleDate,
  formatArticleDate,
  toISODate,
  toDisplayDate,
  toISOTime,
  toDisplayTime,
};
