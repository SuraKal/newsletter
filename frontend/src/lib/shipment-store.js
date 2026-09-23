import { appParams } from "@/lib/app-params";
import {
  adminShipmentRows,
  businessShipmentRows,
} from "@/lib/demoData";
import { notifyStoreChange } from "@/lib/store-bus";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const shipmentsKey = `${appParams.storagePrefix}_shipment_runs`;

function buildSeedRows() {
  return [
    ...adminShipmentRows.map((row) => ({ ...row, owner: "admin" })),
    ...businessShipmentRows.map((row) => ({ ...row, owner: "business" })),
  ];
}

function readAll() {
  if (!storage) return buildSeedRows();
  const raw = storage.getItem(shipmentsKey);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fall through to reseed
    }
  }
  const seeded = buildSeedRows();
  writeAll(seeded);
  return seeded;
}

function writeAll(rows) {
  if (storage) storage.setItem(shipmentsKey, JSON.stringify(rows));
  notifyStoreChange();
}

export function getAdminShipmentRows() {
  return readAll().filter((row) => row.owner === "admin");
}

export function getBusinessShipmentRows() {
  return readAll().filter((row) => row.owner === "business");
}

export function setBusinessShipmentRows(rows) {
  const list = Array.isArray(rows) ? rows : [];
  const all = readAll().filter((row) => row.owner !== "business");
  const next = [
    ...all,
    ...list.map((row) => ({ ...row, owner: "business" })),
  ];
  writeAll(next);
  return list;
}

export function setAdminShipmentRows(rows) {
  const list = Array.isArray(rows) ? rows : [];
  const all = readAll().filter((row) => row.owner !== "admin");
  const next = [
    ...list.map((row) => ({ ...row, owner: "admin" })),
    ...all,
  ];
  writeAll(next);
  return list;
}

export function getShipmentById(id) {
  if (!id) return null;
  return readAll().find((row) => row.id === id) || null;
}

export function updateShipment(id, patch) {
  const all = readAll();
  const index = all.findIndex((row) => row.id === id);
  if (index < 0) return null;

  const next = { ...all[index], ...patch };
  all[index] = next;
  writeAll(all);
  return next;
}