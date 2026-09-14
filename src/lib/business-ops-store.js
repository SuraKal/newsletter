import { appParams } from "@/lib/app-params";
import {
  businessInvoiceRows,
  businessLocationRows,
  businessOrderRows,
  businessTeamRows,
} from "@/lib/demoData";
import { notifyStoreChange } from "@/lib/store-bus";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;

const collections = {
  locations: {
    key: `${appParams.storagePrefix}_business_locations`,
    seed: businessLocationRows.map((row) => ({ ...row })),
  },
  orders: {
    key: `${appParams.storagePrefix}_business_orders`,
    seed: businessOrderRows.map((row) => ({ ...row })),
  },
  invoices: {
    key: `${appParams.storagePrefix}_business_invoices`,
    seed: businessInvoiceRows.map((row) => ({ ...row })),
  },
  teamMembers: {
    key: `${appParams.storagePrefix}_business_team_members`,
    seed: businessTeamRows.map((row) => ({ ...row })),
  },
};

function readAll(name) {
  const { key, seed } = collections[name];
  if (!storage) return seed;
  const raw = storage.getItem(key);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      // fall through to reseed
    }
  }
  writeAll(name, seed);
  return seed;
}

function writeAll(name, rows) {
  if (storage) storage.setItem(collections[name].key, JSON.stringify(rows));
  notifyStoreChange();
}

function updateById(name, id, patch) {
  const all = readAll(name);
  const index = all.findIndex((row) => row.id === id);
  if (index < 0) return null;

  const next = { ...all[index], ...patch };
  all[index] = next;
  writeAll(name, all);
  return next;
}

export function getBusinessLocationRows() {
  return readAll("locations");
}

export function getBusinessLocationById(id) {
  if (!id) return null;
  return readAll("locations").find((row) => row.id === id) || null;
}

export function updateBusinessLocation(id, patch) {
  return updateById("locations", id, patch);
}

export function getBusinessOrderRows() {
  return readAll("orders");
}

export function getBusinessOrderById(id) {
  if (!id) return null;
  return readAll("orders").find((row) => row.id === id) || null;
}

export function updateBusinessOrder(id, patch) {
  return updateById("orders", id, patch);
}

export function getBusinessInvoiceRows() {
  return readAll("invoices");
}

export function getBusinessInvoiceById(id) {
  if (!id) return null;
  return readAll("invoices").find((row) => row.id === id) || null;
}

export function updateBusinessInvoice(id, patch) {
  return updateById("invoices", id, patch);
}

export function getBusinessTeamRows() {
  return readAll("teamMembers");
}

export function getBusinessTeamMemberById(id) {
  if (!id) return null;
  return readAll("teamMembers").find((row) => row.id === id) || null;
}

export function updateBusinessTeamMember(id, patch) {
  return updateById("teamMembers", id, patch);
}