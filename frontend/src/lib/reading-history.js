import { appParams } from "@/lib/app-params";
import { parseArticleDate, readerHistoryRows } from "@/lib/demoData";
import { notifyStoreChange } from "@/lib/store-bus";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const historyKey = `${appParams.storagePrefix}_reader_history`;

const seedArticleIds = {
  "history-1": "news-1",
  "history-2": "business-1",
  "history-3": "feat-1",
  "history-4": "community-1",
};

const formatDateLabel = (timestamp) => {
  if (!timestamp) return "";
  try {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const isSameDay = (timestamp, reference = new Date()) => {
  const date = new Date(timestamp);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
};

const readAll = () => {
  if (!storage) return {};
  const rawValue = storage.getItem(historyKey);
  if (!rawValue) return {};
  try {
    const parsed = JSON.parse(rawValue);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    // fall through to empty records
  }
  return {};
};

const writeAll = (records) => {
  if (storage) {
    storage.setItem(historyKey, JSON.stringify(records));
    notifyStoreChange(historyKey);
  }
};

const baseRecordFromArticle = (article) => ({
  articleId: article?.id || "",
  title: article?.headline || article?.title || "",
  category: article?.category || "",
});

const seedRows = () =>
  readerHistoryRows.map((row) => ({
    id: row.id,
    articleId: seedArticleIds[row.id] || row.id,
    item: row.item,
    category: row.category,
    status: row.status,
    tone: row.tone,
    date: row.date,
    seeded: true,
  }));

const statusInfoFor = (record) => {
  if (record.saved) return { status: "Saved", tone: "success" };
  if (record.shared) return { status: "Shared", tone: "info" };
  if (record.lastRead && isSameDay(record.lastRead)) {
    return { status: "Read today", tone: "info" };
  }
  if (record.lastRead) return { status: "Read", tone: "neutral" };
  return { status: "Viewed", tone: "neutral" };
};

const rowFromRecord = (record) => {
  const statusInfo = statusInfoFor(record);
  const dateStamp = record.lastRead || record.lastShared || record.createdAt;
  return {
    id: record.articleId,
    articleId: record.articleId,
    item: record.title || "Untitled story",
    category: record.category || "News",
    status: statusInfo.status,
    tone: statusInfo.tone,
    date: formatDateLabel(dateStamp),
  };
};

const byDateDesc = (a, b) => {
  const timeA = parseArticleDate(a.date)?.getTime() || 0;
  const timeB = parseArticleDate(b.date)?.getTime() || 0;
  return timeB - timeA;
};

export function recordArticleView(article) {
  const id = article?.id;
  if (!id) return;
  const records = readAll();
  const existing = records[id] || baseRecordFromArticle(article);
  records[id] = {
    ...existing,
    ...baseRecordFromArticle(article),
    lastRead: new Date().toISOString(),
    createdAt: existing.createdAt || new Date().toISOString(),
  };
  writeAll(records);
}

export function recordArticleShare(article) {
  const id = article?.id;
  if (!id) return;
  const records = readAll();
  const existing = records[id] || baseRecordFromArticle(article);
  records[id] = {
    ...existing,
    ...baseRecordFromArticle(article),
    lastRead: new Date().toISOString(),
    lastShared: new Date().toISOString(),
    shared: true,
    createdAt: existing.createdAt || new Date().toISOString(),
  };
  writeAll(records);
}

export function toggleArticleSaved(article) {
  const id = article?.id;
  if (!id) return false;
  const records = readAll();
  const existing = records[id] || {
    ...baseRecordFromArticle(article),
    createdAt: new Date().toISOString(),
  };
  const nextSaved = !existing.saved;
  records[id] = {
    ...existing,
    ...baseRecordFromArticle(article),
    saved: nextSaved,
    touchedAt: new Date().toISOString(),
  };
  writeAll(records);
  return nextSaved;
}

export const isArticleSaved = (articleId) => {
  if (!articleId) return false;
  return Boolean(readAll()[articleId]?.saved);
};

export function getReadingHistoryRows() {
  const persisted = Object.values(readAll());
  const seenIds = new Set(persisted.map((record) => record.articleId));
  const additionalSeedRows = seedRows().filter((row) => !seenIds.has(row.articleId));
  return [
    ...persisted.map(rowFromRecord),
    ...additionalSeedRows,
  ].sort(byDateDesc);
}
