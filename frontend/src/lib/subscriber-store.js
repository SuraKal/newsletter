import { appParams } from "@/lib/app-params";
import { adminSubscriberRows } from "@/lib/demoData";
import { notifyStoreChange } from "@/lib/store-bus";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const subscribersKey = `${appParams.storagePrefix}_subscriber_accounts`;

function buildSeedRows() {
  return adminSubscriberRows.map((row) => ({ ...row }));
}

function readAll() {
  if (!storage) return buildSeedRows();
  const raw = storage.getItem(subscribersKey);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      // fall through to reseed
    }
  }
  const seeded = buildSeedRows();
  writeAll(seeded);
  return seeded;
}

function writeAll(rows) {
  if (storage) storage.setItem(subscribersKey, JSON.stringify(rows));
  notifyStoreChange();
}

export function getSubscriberRows() {
  return readAll();
}

// Replaces the cached list with backend-synced rows. Used by `appClient` after
// an admin subscriber read so the store reflects server truth; `readAll()`'s
// mock seeding stays as the offline fallback only.
export function setSubscriberRows(rows) {
  const next = Array.isArray(rows) ? rows.filter(Boolean).map((row) => ({ ...row })) : [];
  writeAll(next);
  return next;
}

// Merges a single backend row into the cache, adding it when absent.
export function upsertSubscriber(row) {
  if (!row || !row.id) return null;
  const all = readAll();
  const index = all.findIndex((item) => item.id === row.id);
  const next = { ...(index >= 0 ? all[index] : {}), ...row };
  if (index >= 0) {
    all[index] = next;
  } else {
    all.push(next);
  }
  writeAll(all);
  return next;
}

export function getSubscriberById(id) {
  if (!id) return null;
  return readAll().find((row) => row.id === id) || null;
}

export function updateSubscriber(id, patch) {
  const all = readAll();
  const index = all.findIndex((row) => row.id === id);
  if (index < 0) return null;

  const next = { ...all[index], ...patch };
  all[index] = next;
  writeAll(all);
  return next;
}

export function activateSubscriber(id) {
  return updateSubscriber(id, {
    status: "Active",
    tone: "success",
    deliveryEligibility: "Eligible",
  });
}