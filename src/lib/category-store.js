import { appParams } from "@/lib/app-params";
import { IMAGES, CATEGORIES } from "@/lib/constants";
import { getAdminContentRows } from "@/lib/content-store";
import { notifyStoreChange } from "@/lib/store-bus";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const categoriesKey = `${appParams.storagePrefix}_categories`;

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
    if (Array.isArray(parsed) && parsed.length) return parsed;
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

export function getCategories() {
  return readAll();
}

export function getCategoryLabels() {
  return readAll().map((cat) => cat.label);
}

export function getCategoryById(id) {
  return readAll().find((cat) => cat.id === id) || null;
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
  return record;
}

export function deleteCategory(id) {
  writeAll(readAll().filter((cat) => cat.id !== id));
}

export function moveCategory(id, direction) {
  const cats = [...readAll()];
  const index = cats.findIndex((cat) => cat.id === id);
  if (index < 0) return;

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= cats.length) return;

  [cats[index], cats[target]] = [cats[target], cats[index]];
  writeAll(cats);
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
  if (storage) storage.removeItem(categoriesKey);
  notifyStoreChange();
}
