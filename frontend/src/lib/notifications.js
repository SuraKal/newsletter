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

const businessBadges = () => {
  const entity = appClient.company.snapshot();
  const counts = {
    overview: 0,
    team: countWhere(getBusinessTeamRows(), (row) => row.status === "Pending"),
    orders: countWhere(getBusinessOrderRows(), (row) =>
      ["Review", "Queued"].includes(row.status),
    ),
    "order-requests": countWhere(
      appClient.companyOrders.list(),
      (row) => row.status === "Pending approval",
    ),
    invoices: countWhere(getBusinessInvoiceRows(), (row) =>
      ["Review", "Overdue", "Upcoming"].includes(row.status),
    ),
    locations: countWhere(
      getBusinessLocationRows(),
      (row) => row.status === "Review",
    ),
    shipments: countWhere(getBusinessShipmentRows(), (row) =>
      row.status !== "Delivered",
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
  business: businessBadges,
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
    if (workspaceKeyForPath(path) === "reader") {
      loadReaderBadges();
    }
  }, [path]);
  return getSectionBadgeForPath(path);
}
