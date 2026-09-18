import { appParams } from "@/lib/app-params";
import { adminCompanyRows } from "@/lib/demoData";
import { notifyStoreChange } from "@/lib/store-bus";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const accountsKey = `${appParams.storagePrefix}_company_accounts`;

export const COMPANY_WORKFLOW_STATES = [
  "License submitted",
  "License approved",
  "License declined",
];

const legacyStateMap = {
  "Pending review": "License submitted",
  Submitted: "License submitted",
  "Under review": "License submitted",
  "Quote ready": "License submitted",
  Approved: "License approved",
  "Converted to account": "License approved",
  Declined: "License declined",
  Onboarding: "License approved",
  Active: "License approved",
  "Invoice review": "License approved",
};

const workflowTone = {
  "License submitted": "warning",
  "License approved": "success",
  "License declined": "neutral",
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
  notifyStoreChange();
}

export function formatLeadDate(iso) {
  return format_iso(iso);
}

export function getCompanyLeads() {
  return readAll()
    .filter((entity) => {
      const state = getCompanyWorkflowState(entity);
      return state === "License submitted";
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    );
}

export function getCompanyAccounts() {
  return readAll().filter(
    (entity) =>
      getCompanyWorkflowState(entity) === "License approved",
  );
}

export function getCompanyWorkflowState(entity) {
  if (!entity) return null;
  return legacyStateMap[entity.status] || entity.status || "Draft";
}

export function getCompanyWorkflowPresentation(entity) {
  const state = getCompanyWorkflowState(entity);
  const presentation = {
    "License submitted": {
      label: "Licence submitted",
      tone: "warning",
      detail: "Your business licence is awaiting administrator approval. You can sign in once it is approved.",
      action: "Back to business page",
      actionPath: "/business",
    },
    "License approved": {
      label: "Licence approved",
      tone: "success",
      detail: "Your company account is approved. You can place bulk orders and track deliveries.",
      action: "Open business dashboard",
      actionPath: "/business-dashboard/overview",
    },
    "License declined": {
      label: "Licence declined",
      tone: "neutral",
      detail: "Your business licence was not approved. Contact support to submit an updated licence.",
      action: "Contact support",
      actionPath: "/contact",
    },
  };

  return presentation[state] || presentation["License submitted"];
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

  const ownedByEmail = all
    .filter(
      (entity) =>
        (entity.ownerEmail && entity.ownerEmail.toLowerCase() === email) ||
        (entity.workEmail && entity.workEmail.toLowerCase() === email),
    )
    .sort(
      (left, right) =>
        new Date(right.createdAt || 0).getTime() -
        new Date(left.createdAt || 0).getTime(),
    )[0];
  if (ownedByEmail) return ownedByEmail;

  const owned = all.find((entity) => entity.ownerUserId === "business-1");
  if (owned) return owned;

  return (
    all.find(
      (entity) =>
        entity.workEmail &&
        entity.workEmail.toLowerCase() === email,
    ) || null
  );
}

const saveCompanyEntity = (entity) => {
  const all = readAll();
  const index = all.findIndex((entry) => entry.id === entity.id);

  if (index >= 0) {
    all[index] = entity;
  } else {
    all.push(entity);
  }

  writeAll(all);
  return entity;
};

export function transitionCompanyLead(id, nextState) {
  if (!COMPANY_WORKFLOW_STATES.includes(nextState)) return null;
  const all = readAll();
  const index = all.findIndex((entry) => entry.id === id);
  if (index < 0) return null;

  const current = all[index];
  const next = {
    ...current,
    status: nextState,
    tone: workflowTone[nextState],
    volume: current.lead?.expectedCopies || current.volume || "",
    reviewedAt:
      ["License approved", "License declined"].includes(nextState)
        ? new Date().toISOString()
        : current.reviewedAt,
  };

  if (nextState === "License approved") {
    next.ownerEmail = current.lead?.workEmail || current.workEmail || current.ownerEmail;
    next.accountActivatedAt = new Date().toISOString();
  }

  all[index] = next;
  writeAll(all);
  return next;
}

export const approveCompanyLead = (id) => transitionCompanyLead(id, "License approved");

export function declineCompanyLead(id) {
  return transitionCompanyLead(id, "License declined");
}
