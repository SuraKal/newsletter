import { useEffect, useState } from "react";
import { backendCategories } from "@/api/backendClient";
import { appParams } from "@/lib/app-params";
import { IMAGES, CATEGORIES } from "@/lib/constants";
import {
  DEFAULT_ARTICLE_TEMPLATE,
  isValidArticleTemplate,
} from "@/lib/article-templates";
import { getAdminContentRows } from "@/lib/content-store";
import { notifyStoreChange, useStoreVersion } from "@/lib/store-bus";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const categoriesKey = `${appParams.storagePrefix}_categories`;
const categoriesSyncKey = `${appParams.storagePrefix}_categories_sync`;

const imageMap = {
  News: IMAGES.politics,
  Community: IMAGES.culture,
  Business: IMAGES.business,
  "Jobs & Marketplace": IMAGES.economy,
  Events: IMAGES.events,
  "Culture & Lifestyle": IMAGES.culture,
  Technology: IMAGES.technology,
  "Advice Corner": IMAGES.featured,
  "Serial Novels": IMAGES.featured,
  Other: IMAGES.hero,
};

const templateSeed = {
  News: "newspaper",
  Community: "classic",
  Business: "magazine",
  "Jobs & Marketplace": "tabloid",
  Events: "feature",
  "Culture & Lifestyle": "magazine",
  Technology: "feature",
  "Advice Corner": "newsletter",
  "Serial Novels": "newsletter",
  Other: "feature",
};

const subcategorySeed = {
  News: ["Local News", "International", "Community Updates"],
  Community: [
    "Weddings & Love Stories",
    "Birth Announcements",
    "Graduations",
    "Memorials",
    "Success Stories",
    "Community Announcements",
    "Volunteer Opportunities",
  ],
  Business: [
    "Business News",
    "Featured Businesses",
    "Entrepreneur Stories",
    "Investment",
    "Sponsored Businesses",
  ],
  "Jobs & Marketplace": [
    "Job Vacancies",
    "Businesses Hiring",
    "Buy & Sell",
    "Cars",
    "Houses & Apartments",
    "Services",
  ],
  Events: [
    "Community Events",
    "Church Events",
    "Festivals",
    "Concerts",
    "Sports Events",
  ],
  "Culture & Lifestyle": [
    "Culture",
    "Food",
    "Health",
    "Travel",
    "Fashion",
    "Entertainment",
  ],
  Technology: ["AI", "Apps", "Mobile", "Business Technology", "Digital Tips"],
  "Advice Corner": [
    "Anonymous Stories",
    "Relationships",
    "Family",
    "Career Advice",
    "Immigration & Legal Tips",
    "Education",
  ],
  "Serial Novels": [
    "Romance",
    "Mystery",
    "Historical Fiction",
    "Children's Stories",
  ],
  Other: ["Announcements", "General Interest", "Archive Picks"],
};

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildSeedCategories() {
  return CATEGORIES.map((label) => ({
    id: slugify(label),
    label,
    image: imageMap[label] || IMAGES.hero,
    subcategories: subcategorySeed[label] || [],
    template: templateSeed[label] || DEFAULT_ARTICLE_TEMPLATE,
  }));
}

function readAll() {
  if (!storage) return buildSeedCategories();
  const raw = storage.getItem(categoriesKey);
  if (!raw) {
    const seeded = buildSeedCategories();
    writeAll(seeded);
    return seeded;
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) {
      return parsed.map((cat) => ({
        ...cat,
        template:
          isValidArticleTemplate(cat.template) && cat.template
            ? cat.template
            : templateSeed[cat.label] || DEFAULT_ARTICLE_TEMPLATE,
      }));
    }
  } catch {
    /* reseed */
  }
  const seeded = buildSeedCategories();
  writeAll(seeded);
  return seeded;
}

function writeAll(cats) {
  if (storage) storage.setItem(categoriesKey, JSON.stringify(cats));
  notifyStoreChange();
}

// Keeps the backend-synced snapshot in step with local authoring edits. This
// is what makes template changes propagate to article rendering: `getCategoryTemplate`
// reads the synced snapshot first, so any save/delete/move below must mirror into
// it. When the backend is reachable `appClient.refreshCategoriesFromBackend()`
// overwrites this key with authoritative rows, so this mirror only fills the gap
// for offline mock edits.
function writeSynced(cats) {
  if (!storage) return;
  if (Array.isArray(cats) && cats.length) {
    storage.setItem(categoriesSyncKey, JSON.stringify(cats.map(toAppCategory)));
    notifyStoreChange();
  } else {
    storage.removeItem(categoriesSyncKey);
  }
}

export function getCategories() {
  return readAll();
}

export function getCategoryLabels() {
  return readAll().map((cat) => cat.label);
}

export function getCategoryById(id) {
  return readAll().find((cat) => cat.id === id) || null;
}

export function getCategoryTemplate(label) {
  const match = (readSynced() || readAll()).find(
    (cat) => cat.label.toLowerCase() === String(label || "").toLowerCase(),
  );
  if (!match) return DEFAULT_ARTICLE_TEMPLATE;
  return isValidArticleTemplate(match.template)
    ? match.template
    : DEFAULT_ARTICLE_TEMPLATE;
}

// Reads the backend-synced category snapshot (the "wired" read path). Returns
// null when the backend has never pushed a snapshot so callers fall back to the
// seeded mock store instead. This is the same key `appClient` fills via
// `refreshCategoriesFromBackend`, so backend template changes flow through to
// article rendering here.
function readSynced() {
  if (!storage) return null;
  const raw = storage.getItem(categoriesSyncKey);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {
    // fall through to null
  }
  return null;
}

export function saveCategory(data) {
  const cats = readAll();
  const id = data.id || slugify(data.label);
  const record = { ...data, id };

  if (data.id) {
    const index = cats.findIndex((cat) => cat.id === data.id);
    if (index >= 0) {
      cats[index] = record;
    } else {
      cats.push(record);
    }
  } else {
    cats.push(record);
  }

  writeAll(cats);
  writeSynced(cats);
  return record;
}

export function deleteCategory(id) {
  const next = readAll().filter((cat) => cat.id !== id);
  writeAll(next);
  writeSynced(next);
}

export function moveCategory(id, direction) {
  const cats = [...readAll()];
  const index = cats.findIndex((cat) => cat.id === id);
  if (index < 0) return;

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= cats.length) return;

  [cats[index], cats[target]] = [cats[target], cats[index]];
  writeAll(cats);
  writeSynced(cats);
}

export function getCategoryArticleCounts() {
  const rows = getAdminContentRows();
  const counts = {};
  rows.forEach((row) => {
    const key = row.category || "Other";
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

export function resetCategoryStore() {
  if (storage) {
    storage.removeItem(categoriesKey);
    storage.removeItem(categoriesSyncKey);
  }
  notifyStoreChange();
}

// Maps a backend category (from `backendCategories.list()`) into the shape the
// local store consumers expect: string subcategory labels and a `template`
// key instead of `templateKey`.
export function toAppCategory(category) {
  return {
    id: category.id,
    label: category.label,
    image: category.image,
    subcategories: Array.isArray(category.subcategories)
      ? category.subcategories
          .map((sub) => (typeof sub === "string" ? sub : sub?.label))
          .filter(Boolean)
      : [],
    template:
      category.templateKey || category.template || DEFAULT_ARTICLE_TEMPLATE,
  };
}

// Mirrors a freshly fetched backend category list into the synced snapshot so
// template changes made against the Flask API are picked up immediately by
// `getCategoryTemplate` (and therefore article rendering) without waiting for a
// reload. No-op on network failure: the mock mirror from the authoring helpers
// stays in place.
export function syncCategoriesFromBackend(categories) {
  if (!Array.isArray(categories) || !categories.length) return;
  writeSynced(categories.map(toAppCategory));
}

// Public category data source. Tries the Flask backend first; when it is
// unreachable (or fails), keeps the localStorage mock as the fallback so the
// site still renders. Re-fetches whenever the store version changes so admin
// edits in the mock are picked up live.
export function useSyncedCategories() {
  const storeVersion = useStoreVersion();
  const [categories, setCategories] = useState(() => getCategories());

  useEffect(() => {
    let active = true;
    backendCategories
      .list()
      .then((list) => {
        if (!active) return;
        if (Array.isArray(list) && list.length) {
          setCategories(list.map(toAppCategory));
        }
      })
      .catch(() => {
        if (active) setCategories(getCategories());
      });
    return () => {
      active = false;
    };
  }, [storeVersion]);

  return categories;
}
