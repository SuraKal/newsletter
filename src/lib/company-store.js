import { appParams } from "@/lib/app-params";
import { adminCompanyRows } from "@/lib/demoData";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const accountsKey = `${appParams.storagePrefix}_company_accounts`;

const tierForLead = (lead = {}) => {
  const size = String(lead.companySize || "");
  if (size.includes("1000") || size.includes("200")) return "Enterprise Route";
  if (size.includes("51") || size.includes("11")) return "Regional Team";
  return "Single Office";
};

const format_iso = (value) => {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch {
    return "";
  }
};

const buildSeedAccounts = () => [
  ...adminCompanyRows.map((row) => ({
    id: row.id,
    company: row.company,
    tier: row.tier,
    volume: row.volume,
    billing: row.billing,
    status: row.status,
    tone: row.tone,
    region: row.region,
    ownerEmail: null,
    ownerUserId: null,
    workEmail: null,
    createdAt: new Date("2026-01-12T09:00:00Z").toISOString(),
    reviewedAt: new Date("2026-01-14T14:30:00Z").toISOString(),
    lead: null,
  })),
  {
    id: "business-account-1",
    company: `${appParams.appName} Distribution Group`,
    status: "Pending review",
    tone: "warning",
    billing: "Monthly invoice",
    region: "Belgium and Germany",
    workEmail: appParams.businessEmail,
    ownerEmail: appParams.businessEmail,
    ownerUserId: "business-1",
    createdAt: new Date("2026-08-18T08:00:00Z").toISOString(),
    reviewedAt: null,
    lead: {
      primaryContact: "Operations and finance lead",
      workEmail: appParams.businessEmail,
      workPhone: appParams.contactPhone,
      organizationName: `${appParams.appName} Distribution Group`,
      requestType: "Business Subscription",
      companySize: "51-200",
      countryScope: "Belgium and Germany",
      expectedCopies: "475 copies across HQ and partner desks",
      deliveryLocations: "Brussels, Antwerp, Cologne, and Berlin",
      billingPreference: "Monthly invoice",
      launchTimeline: "Within 1 month",
      operationalNotes:
        "Consolidated HQ plus regional branch and partner desk distribution under one account.",
    },
  },
];

function readAll() {
  if (!storage) return buildSeedAccounts();
  const raw = storage.getItem(accountsKey);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch {
      // fall through to reseed
    }
  }
  const seeded = buildSeedAccounts();
  writeAll(seeded);
  return seeded;
}

function writeAll(accounts) {
  if (storage) storage.setItem(accountsKey, JSON.stringify(accounts));
}

export function formatLeadDate(iso) {
  return format_iso(iso);
}

export function getCompanyLeads() {
  return readAll()
    .filter((entity) => entity.status === "Pending review")
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    );
}

export function getCompanyAccounts() {
  return readAll().filter(
    (entity) =>
      entity.status !== "Pending review" && entity.status !== "Declined",
  );
}

export function getCompanyEntityById(id) {
  if (!id) return null;
  return readAll().find((entity) => entity.id === id) || null;
}

export function getBusinessCompanySnapshot(userEmail) {
  const email = String(
    userEmail || appParams.businessEmail || "",
  ).toLowerCase();
  const all = readAll();

  const owned = all.find(
    (entity) =>
      (entity.ownerEmail &&
        entity.ownerEmail.toLowerCase() === email) ||
      entity.ownerUserId === "business-1",
  );
  if (owned) return owned;

  return (
    all.find(
      (entity) =>
        entity.workEmail &&
        entity.workEmail.toLowerCase() === email,
    ) || null
  );
}

export function submitCompanyLead(record) {
  if (!record?.id) return null;

  const entity = {
    id: record.id,
    company:
      record.organizationName || record.company || "Unnamed organization",
    status: "Pending review",
    tone: "warning",
    tier: null,
    volume: record.expectedCopies || "",
    billing: record.billingPreference || "",
    region: record.countryScope || "",
    workEmail: record.workEmail || "",
    ownerEmail: null,
    ownerUserId: null,
    createdAt: record.createdAt || new Date().toISOString(),
    reviewedAt: null,
    lead: record,
  };

  const all = readAll();
  const index = all.findIndex((entry) => entry.id === entity.id);

  if (index >= 0) {
    all[index] = entity;
  } else {
    all.push(entity);
  }

  writeAll(all);
  return entity;
}

export function approveCompanyLead(id) {
  const all = readAll();
  const index = all.findIndex((entry) => entry.id === id);
  if (index < 0) return null;

  const current = all[index];
  if (current.status !== "Pending review") return current;

  const next = {
    ...current,
    status: "Onboarding",
    tone: "neutral",
    tier: tierForLead(current.lead),
    volume: current.lead?.expectedCopies || current.volume || "",
    reviewedAt: new Date().toISOString(),
  };

  all[index] = next;
  writeAll(all);
  return next;
}

export function declineCompanyLead(id) {
  const all = readAll();
  const index = all.findIndex((entry) => entry.id === id);
  if (index < 0) return null;

  const current = all[index];
  if (current.status !== "Pending review") return current;

  const next = {
    ...current,
    status: "Declined",
    tone: "neutral",
    reviewedAt: new Date().toISOString(),
  };

  all[index] = next;
  writeAll(all);
  return next;
}