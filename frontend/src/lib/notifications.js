import { useEffect } from "react";
import { getAdminContentRows, getAdminScheduleRows } from "@/lib/content-store";
import { getCompanyWorkflowState } from "@/lib/company-store";
import { appClient, getGovernanceActionCount } from "@/api/appClient";
import { dashboardWorkspaces } from "@/lib/dashboard-config";
import { getSubscriberRows } from "@/lib/subscriber-store";
import {
  getAdminShipmentRows,
  getBusinessShipmentRows,
} from "@/lib/shipment-store";
import {
  getBusinessInvoiceRows,
  getBusinessLocationRows,
  getBusinessOrderRows,
  getBusinessTeamRows,
} from "@/lib/business-ops-store";
import { readerBillingRows, readerDeliveryCurrent } from "@/lib/demoData";
import { notifyStoreChange, useStoreVersion } from "@/lib/store-bus";

const countWhere = (rows, predicate) =>
  Array.isArray(rows) ? rows.filter(predicate).length : 0;

const adminBadges = () => {
  const counts = {
    overview: 0,
    content: countWhere(
      getAdminContentRows(),
      (row) => row.status !== "Published",
    ),
    schedule: countWhere(getAdminScheduleRows(), (row) =>
      ["Needs review", "Draft"].includes(row.status),
    ),
    subscribers: countWhere(getSubscriberRows(), (row) =>
      row.status !== "Active",
    ),
    companies: appClient.company.list().length,
    governance: getGovernanceActionCount(),
    "order-requests": countWhere(
      appClient.companyOrders.list(),
      (row) => row.status === "Pending approval",
    ),
    shipments: countWhere(getAdminShipmentRows(), (row) =>
      ["Delay flagged", "Delayed", "Escalated", "Delay watch"].includes(
        row.status,
      ),
    ),
  };
  counts.overview = totalFor(counts);
  return counts;
};

// Returns true when a business row belongs to the current logged-in company.
// Rows returned by the backend carry `companyAccountId`; the legacy demo seed
// rows do not, so they only count for the seeded demo company (`business-account-1`).
const belongsToCurrentCompany = (companyId) => (row) => {
  if (!row || !companyId) return false;
  if (row.companyAccountId) return row.companyAccountId === companyId;
  return companyId === "business-account-1";
};

const businessCounts = () => {
  const entity = appClient.company.snapshot();
  const owned = belongsToCurrentCompany(entity?.id);
  const counts = {
    overview: 0,
    team: countWhere(
      getBusinessTeamRows().filter(owned),
      (row) => row.status === "Pending",
    ),
    orders: countWhere(
      getBusinessOrderRows().filter(owned),
      (row) => ["Review", "Queued"].includes(row.status),
    ),
    "order-requests": countWhere(
      appClient.companyOrders.list().filter(owned),
      (row) => row.status === "Pending approval",
    ),
    invoices: countWhere(
      getBusinessInvoiceRows().filter(owned),
      (row) => ["Review", "Overdue", "Upcoming"].includes(row.status),
    ),
    locations: countWhere(
      getBusinessLocationRows().filter(owned),
      (row) => row.status === "Review",
    ),
    shipments: countWhere(
      getBusinessShipmentRows().filter(owned),
      (row) => row.status !== "Delivered",
    ),
    settings:
      !entity || getCompanyWorkflowState(entity) !== "License approved"
        ? 1
        : 0,
  };
  counts.overview = totalFor(counts);
  return counts;
};

const readerCountsFrom = ({ current, billingRows }) => {
  const counts = {
    overview: 0,
    deliveries: current && current.status !== "Delivered" ? 1 : 0,
    billing: countWhere(billingRows, (row) =>
      ["Upcoming", "Overdue"].includes(row.status),
    ),
    history: 0,
    profile: 0,
    privacy: 0,
  };
  counts.overview = totalFor(counts);
  return counts;
};

const demoReaderCounts = () =>
  readerCountsFrom({ current: readerDeliveryCurrent, billingRows: readerBillingRows });

// Backend-fed counts for the company workspace chips. The refresh calls push
// backend rows (filtered by the authenticated company) into the business
// stores, so `businessCounts` reflects the real per-company data instead of
// the shared seeded rows. Counts are always computed live from the stores so
// badges update as the user navigates; `notifyStoreChange` fires the re-render.
let businessBadgeLoadStarted = false;

async function loadBusinessBadges() {
  if (businessBadgeLoadStarted) {
    return;
  }
  businessBadgeLoadStarted = true;
  try {
    await Promise.allSettled([
      appClient.businessTeam.list(),
      appClient.orderPlans.refresh(),
      appClient.companyOrders.businessList(),
      appClient.invoices.refresh(),
      appClient.locations.refresh(),
      appClient.shipments.refresh(),
      appClient.company.refresh(),
    ]);
  } finally {
    businessBadgeLoadStarted = false;
    notifyStoreChange("business-badges");
  }
}

// Backend-fed counts for the reader workspace chips. Loaded once per page
// visit; the demo rows stand in while loading and offline. `notifyStoreChange`
// re-renders `useStoreVersion` consumers (Overview page, DashboardShell).
let readerBadgeCounts = null;
let readerBadgeLoadStarted = false;

async function loadReaderBadges() {
  if (readerBadgeLoadStarted) {
    return;
  }
  readerBadgeLoadStarted = true;
  try {
    const [deliveriesResult, billingResult] = await Promise.allSettled([
      appClient.reader.deliveries(),
      appClient.reader.billing(),
    ]);
    const deliveriesOk = deliveriesResult.status === "fulfilled";
    const billingOk = billingResult.status === "fulfilled";
    if (deliveriesOk || billingOk) {
      readerBadgeCounts = readerCountsFrom({
        current: deliveriesOk ? deliveriesResult.value.current || null : readerDeliveryCurrent,
        billingRows: billingOk ? billingResult.value : readerBillingRows,
      });
    }
  } finally {
    readerBadgeLoadStarted = false;
    notifyStoreChange("reader-badges");
  }
}

const readerBadges = () => readerBadgeCounts || demoReaderCounts();

const badgeComputers = {
  admin: adminBadges,
  business: businessCounts,
  reader: readerBadges,
};

const totalFor = (counts) =>
  Object.values(counts).reduce((sum, value) => sum + (value || 0), 0);

const workspaceKeyForPath = (path) => {
  if (!path) return null;
  for (const workspace of Object.values(dashboardWorkspaces)) {
    for (const section of workspace.sections) {
      if (path === section.path || `${path}/`.startsWith(`${section.path}/`)) {
        return workspace.key;
      }
    }
  }
  return null;
};

export function getWorkspaceSectionBadges(workspaceKey) {
  const compute = badgeComputers[workspaceKey];
  if (!compute) return {};
  return compute();
}

export function useWorkspaceSectionBadges(workspaceKey) {
  useStoreVersion();
  useEffect(() => {
    if (workspaceKey === "reader") {
      loadReaderBadges();
    }
    if (workspaceKey === "business") {
      loadBusinessBadges();
    }
  }, [workspaceKey]);
  return getWorkspaceSectionBadges(workspaceKey);
}

export function getWorkspaceNotificationTotal(workspaceKey) {
  return totalFor(getWorkspaceSectionBadges(workspaceKey));
}

export function useWorkspaceNotificationTotal(workspaceKey) {
  useStoreVersion();
  useEffect(() => {
    if (workspaceKey === "reader") {
      loadReaderBadges();
    }
    if (workspaceKey === "business") {
      loadBusinessBadges();
    }
  }, [workspaceKey]);
  return getWorkspaceNotificationTotal(workspaceKey);
}

export function getSectionBadgeForPath(path) {
  if (!path) return 0;
  for (const workspace of Object.values(dashboardWorkspaces)) {
    for (const section of workspace.sections) {
      if (path === section.path || `${path}/`.startsWith(`${section.path}/`)) {
        return getWorkspaceSectionBadges(workspace.key)[section.id] || 0;
      }
    }
  }
  return 0;
}

export function useSectionBadgeForPath(path) {
  useStoreVersion();
  useEffect(() => {
    const key = workspaceKeyForPath(path);
    if (key === "reader") {
      loadReaderBadges();
    }
    if (key === "business") {
      loadBusinessBadges();
    }
  }, [path]);
  return getSectionBadgeForPath(path);
}
