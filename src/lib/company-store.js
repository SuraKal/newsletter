import { appParams } from "@/lib/app-params";
import { adminCompanyRows } from "@/lib/demoData";
import { notifyStoreChange } from "@/lib/store-bus";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const accountsKey = `${appParams.storagePrefix}_company_accounts`;

export const COMPANY_WORKFLOW_STATES = [
  "Draft",
  "Submitted",
  "Under review",
  "Quote ready",
  "Approved",
  "Declined",
  "Converted to account",
];

const legacyStateMap = {
  "Pending review": "Under review",
  Onboarding: "Approved",
  Active: "Converted to account",
};

const workflowTone = {
  Draft: "neutral",
  Submitted: "info",
  "Under review": "warning",
  "Quote ready": "info",
  Approved: "success",
  Declined: "neutral",
  "Converted to account": "success",
};

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
  notifyStoreChange();
}

export function formatLeadDate(iso) {
  return format_iso(iso);
}

export function getCompanyLeads() {
  return readAll()
    .filter((entity) => {
      const state = getCompanyWorkflowState(entity);
      return (
        state !== "Converted to account" &&
        !["Active", "Onboarding", "Invoice review"].includes(entity.status)
      );
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
      getCompanyWorkflowState(entity) === "Converted to account" ||
      ["Onboarding", "Invoice review"].includes(entity.status),
  );
}

export function getCompanyWorkflowState(entity) {
  if (!entity) return null;
  return legacyStateMap[entity.status] || entity.status || "Draft";
}

export function getCompanyWorkflowPresentation(entity) {
  const state = getCompanyWorkflowState(entity);
  const presentation = {
    Draft: {
      label: "Draft",
      tone: "neutral",
      detail: "The request is saved but has not been submitted for commercial review.",
      action: "Continue application",
      actionPath: entity?.id ? `/business/apply?draft=${entity.id}` : "/business/apply",
    },
    Submitted: {
      label: "Submitted",
      tone: "info",
      detail: "The request is queued for the commercial team to review.",
      action: "View request",
      actionPath: entity?.id ? `/business/apply/success?request=${entity.id}` : "/business",
    },
    "Under review": {
      label: "Under review",
      tone: "warning",
      detail: "The commercial team is checking volume, billing, and delivery scope.",
      action: "View review status",
      actionPath: entity?.id ? `/business/apply/success?request=${entity.id}` : "/business",
    },
    "Quote ready": {
      label: "Quote ready",
      tone: "info",
      detail: "A volume and delivery quote is ready for approval.",
      action: "Review quote",
      actionPath: entity?.id ? `/business/apply/success?request=${entity.id}` : "/business",
    },
    Approved: {
      label: "Approved",
      tone: "success",
      detail: "The request is approved and waiting for account conversion.",
      action: "View approval",
      actionPath: "/business-dashboard/overview",
    },
    Declined: {
      label: "Declined",
      tone: "neutral",
      detail: "The commercial team declined this request. A new request can be started.",
      action: "Start new request",
      actionPath: "/business/apply",
    },
    "Converted to account": {
      label: "Converted to account",
      tone: "success",
      detail: "The company account is active and ready for business workspace operations.",
      action: "Open business dashboard",
      actionPath: "/business-dashboard/overview",
    },
  };

  return presentation[state] || presentation.Draft;
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

const buildCompanyEntity = (record, status) => ({
  id: record.id,
  company:
    record.organizationName || record.company || "Unnamed organization",
  status,
  tone: workflowTone[status],
  tier: null,
  volume: record.expectedCopies || "",
  billing: record.billingPreference || "",
  region: record.countryScope || "",
  workEmail: record.workEmail || "",
  ownerEmail: record.workEmail || null,
  ownerUserId: null,
  createdAt: record.createdAt || new Date().toISOString(),
  reviewedAt: null,
  quote: null,
  lead: record,
});

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

export function saveCompanyLeadDraft(record) {
  if (!record?.id) return null;
  return saveCompanyEntity(buildCompanyEntity(record, "Draft"));
}

export function submitCompanyLead(record) {
  if (!record?.id) return null;

  return saveCompanyEntity(buildCompanyEntity(record, "Submitted"));
}

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
    tier:
      nextState === "Quote ready" || nextState === "Approved" || nextState === "Converted to account"
        ? tierForLead(current.lead)
        : current.tier,
    volume: current.lead?.expectedCopies || current.volume || "",
    reviewedAt:
      ["Under review", "Quote ready", "Approved", "Declined", "Converted to account"].includes(nextState)
        ? new Date().toISOString()
        : current.reviewedAt,
  };

  if (nextState === "Quote ready") {
    next.quote = {
      tier: tierForLead(current.lead),
      volume: current.lead?.expectedCopies || current.volume || "Not specified",
      billing: current.lead?.billingPreference || current.billing || "To be confirmed",
      delivery: current.lead?.deliveryLocations || "To be confirmed",
      preparedAt: new Date().toISOString(),
      note: "Mock quote prepared for commercial approval.",
    };
  }

  if (nextState === "Converted to account") {
    next.ownerEmail = current.lead?.workEmail || current.workEmail || current.ownerEmail;
    next.accountActivatedAt = new Date().toISOString();
  }

  all[index] = next;
  writeAll(all);
  return next;
}

export const startCompanyReview = (id) => transitionCompanyLead(id, "Under review");
export const prepareCompanyQuote = (id) => transitionCompanyLead(id, "Quote ready");
export const approveCompanyLead = (id) => transitionCompanyLead(id, "Approved");
export const convertCompanyLead = (id) =>
  transitionCompanyLead(id, "Converted to account");

export function declineCompanyLead(id) {
  return transitionCompanyLead(id, "Declined");
}
