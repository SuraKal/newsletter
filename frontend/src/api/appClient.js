import {
  backendAdminOverview,
  backendArticles,
  backendAuth,
  backendBusinessOverview,
  backendCategories,
  backendCheckout,
  backendCompanies,
  backendConsents,
  backendGovernance,
  backendInvoices,
  backendLegal,
  backendLocations,
  backendOrderPlans,
  backendOrders,
  backendPaymentMethods,
  backendShipments,
  backendSubscribers,
  backendSubscriptions,
  backendReader,
  backendTeam,
  cacheBackendUser,
  clearAccessToken,
  getAccessToken,
  getCachedBackendUser,
  isNetworkError,
  saveAccessToken,
} from "@/api/backendClient";
import { appParams } from "@/lib/app-params";
import {
  adminOverviewMetrics,
  adminShipmentActivityRows,
  businessOverviewMetrics,
  businessShipmentActivityRows,
  companyOrderRequests as defaultCompanyOrders,
  subscriptionPlans as defaultSubscriptionPlans,
} from "@/lib/demoData";
import { getCategories, syncCategoriesFromBackend } from "@/lib/category-store";
import { notifyStoreChange } from "@/lib/store-bus";
import { syncArticlesFromBackend, getAllArticles } from "@/lib/content-store";
import {
  getBusinessCompanySnapshot,
  getCompanyLeads,
  getCompanyWorkflowState,
} from "@/lib/company-store";
import {
  getBusinessInvoiceById,
  getBusinessInvoiceRows,
  getBusinessLocationById,
  getBusinessLocationRows,
  getBusinessOrderById,
  getBusinessOrderRows,
  getBusinessTeamRows,
  setBusinessInvoiceRows,
  setBusinessLocationRows,
  setBusinessOrderRows,
  setBusinessTeamRows,
  updateBusinessTeamMember,
} from "@/lib/business-ops-store";
import {
  getAdminShipmentRows,
  getBusinessShipmentRows,
  getShipmentById,
  setAdminShipmentRows,
  setBusinessShipmentRows,
} from "@/lib/shipment-store";
import {
  getSubscriberById,
  getSubscriberRows,
  setSubscriberRows,
  upsertSubscriber,
} from "@/lib/subscriber-store";
import { getReaderSubscriptionSnapshot } from "@/lib/reader-subscription";
import {
  getCurrentDelivery,
  getDeliveryByTrackingCode,
  getRecentDeliveries,
} from "@/lib/delivery-store";
import { getReadingHistoryRows } from "@/lib/reading-history";
import { getReaderBillingRows } from "@/lib/reader-billing-store";
import {
  readCheckoutSessions,
  saveCheckoutSession,
} from "@/lib/checkout-store";
import { DEFAULT_PAYMENT_METHODS } from "@/lib/payment-methods";
import {
  getDefaultLegalPage,
  getLegalPage,
  LEGAL_PAGE_KEYS,
  saveLegalPage,
  toLegalPage,
} from "@/lib/legal-store";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const usersKey = `${appParams.storagePrefix}_users`;
const sessionKey = `${appParams.storagePrefix}_session`;
const resetTokensKey = `${appParams.storagePrefix}_reset_tokens`;
const governanceRequestsKey = `${appParams.storagePrefix}_governance_requests`;
const subscriptionPlansKey = `${appParams.storagePrefix}_subscription_plans`;
const companyOrdersKey = `${appParams.storagePrefix}_company_orders`;
const categoriesSyncKey = `${appParams.storagePrefix}_categories_sync`;
const companySyncKey = `${appParams.storagePrefix}_company_sync`;
const companyListSyncKey = `${appParams.storagePrefix}_company_list_sync`;

const defaultUsers = [
  {
    id: "admin-1",
    name: `${appParams.appName} Admin`,
    email: appParams.adminEmail,
    password: appParams.adminPassword,
    role: "admin",
    accountType: "admin",
  },
  {
    id: "reader-1",
    name: `${appParams.appName} Reader`,
    email: appParams.readerEmail,
    password: appParams.readerPassword,
    role: "reader",
    accountType: "individual",
  },
  {
    id: "business-1",
    name: `${appParams.appName} Operations`,
    email: appParams.businessEmail,
    password: appParams.businessPassword,
    role: "business",
    accountType: "business",
    companyName: `${appParams.appName} Distribution Group`,
  },
];

const createAuthError = (message, status = 400) => {
  /** @type {Error & { status?: number }} */
  const error = new Error(message);
  error.status = status;
  return error;
};

const normalizeEmail = (email) => email.trim().toLowerCase();

const readJson = (key, fallback) => {
  if (!storage) {
    return fallback;
  }

  const rawValue = storage.getItem(key);
  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return fallback;
  }
};

const writeJson = (key, value) => {
  if (!storage) {
    return;
  }

  storage.setItem(key, JSON.stringify(value));
  notifyStoreChange(key);
};

const ensureSeedData = () => {
  if (!storage) {
    return;
  }

  const existingUsers = readJson(usersKey, []);
  const existingUserList = Array.isArray(existingUsers) ? existingUsers : [];
  const preservedUsers = existingUserList.filter(
    (user) =>
      user.id !== "admin-1" &&
      user.id !== "reader-1" &&
      user.id !== "business-1",
  );

  const nextUsers = [...defaultUsers, ...preservedUsers];
  if (JSON.stringify(existingUserList) !== JSON.stringify(nextUsers)) {
    writeJson(usersKey, nextUsers);
  }

  if (!storage.getItem(resetTokensKey)) {
    writeJson(resetTokensKey, {});
  }

  if (!storage.getItem(governanceRequestsKey)) {
    const now = Date.now();
    writeJson(governanceRequestsKey, [
      {
        id: "demo-export-1",
        userId: "reader-1",
        scope: "reader",
        type: "Data export",
        status: "Queued",
        date: formatRequestDate(new Date(now - 2 * 86400000)),
        createdAt: new Date(now - 2 * 86400000).toISOString(),
        notes:
          "Full account and subscription export requested from the reader privacy workspace.",
      },
      {
        id: "demo-deletion-1",
        userId: "business-1",
        scope: "company",
        type: "Company deletion review",
        status: "Review required",
        date: formatRequestDate(new Date(now - 86400000)),
        createdAt: new Date(now - 86400000).toISOString(),
        notes:
          "Business account retention review requested under the company privacy workflow.",
      },
    ]);
  }

  const storedPlans = readJson(subscriptionPlansKey, null);
  if (!Array.isArray(storedPlans) || !storedPlans.length) {
    writeJson(subscriptionPlansKey, defaultSubscriptionPlans);
  }

  const storedOrders = readJson(companyOrdersKey, null);
  if (!Array.isArray(storedOrders) || !storedOrders.length) {
    writeJson(companyOrdersKey, defaultCompanyOrders);
  }
};

const readSubscriptionPlans = () => {
  ensureSeedData();
  const plans = readJson(subscriptionPlansKey, defaultSubscriptionPlans);
  if (!Array.isArray(plans) || !plans.length) {
    writeJson(subscriptionPlansKey, defaultSubscriptionPlans);
    return defaultSubscriptionPlans.map(normalizeSubscriptionPlan);
  }
  return plans.map(
    normalizeSubscriptionPlan,
  );
};

const writeSubscriptionPlans = (plans) => {
  writeJson(subscriptionPlansKey, plans);
  if (isBrowser) {
    window.dispatchEvent(new CustomEvent("nekedem:subscription-plans-updated"));
  }
};

const normalizeCompanyOrder = (order) => ({
  id: order.id,
  companyAccountId: order.companyAccountId ?? null,
  company: order.company || "",
  copies: Number(order.copies) || 0,
  neededBy: order.neededBy || "",
  deliveryLocations: Array.isArray(order.deliveryLocations)
    ? order.deliveryLocations
    : [],
  articleId: order.articleId ?? null,
  articleTitle: order.articleTitle || "",
  estimatedPrice: Number(order.estimatedPrice) || 0,
  rate: Number(order.rate) || 0,
  status: order.status || "Pending approval",
  tone: order.tone || "warning",
  finalPrice: order.finalPrice == null ? null : Number(order.finalPrice),
  requestedBy: order.requestedBy ?? null,
  reviewedBy: order.reviewedBy ?? null,
  reviewedAt: order.reviewedAt || "",
  createdAt: order.createdAt || "",
  updatedAt: order.updatedAt || "",
});

export const estimateOrderPrice = (copies) => {
  const count = Math.max(1, Math.floor(Number(copies) || 0));
  const rate = count <= 100 ? 1.2 : count <= 500 ? 1.05 : 0.9;
  const total = Math.round(count * rate * 100) / 100;
  return { total, rate };
};

const readCompanyOrders = () => {
  ensureSeedData();
  const orders = readJson(companyOrdersKey, defaultCompanyOrders);
  if (!Array.isArray(orders)) {
    return defaultCompanyOrders.map(normalizeCompanyOrder);
  }
  return orders.map(normalizeCompanyOrder);
};

const writeCompanyOrders = (orders) => {
  writeJson(companyOrdersKey, orders);
  if (isBrowser) {
    window.dispatchEvent(new CustomEvent("nekedem:company-orders-updated"));
  }
};

// Refreshes the locally cached subscription plans from the Flask backend.
// This is the "wired" read path: when the backend is reachable its plan rows
// become the source of truth for every surface that consumes the plan catalog,
// and it still falls back to the seeded mock cache when the backend is down.
const refreshPlansFromBackend = async () => {
  try {
    const plans = await backendSubscriptions.list();
    if (Array.isArray(plans) && plans.length) {
      writeSubscriptionPlans(plans);
    }
  } catch {
    // Backend unreachable or failing: keep the local mock cache untouched.
  }
};

// Refreshes the locally cached category catalog from the Flask backend.
// Same wired pattern as the plan catalog: the backend rows become the source
// of truth when it is reachable, while `appClient.categories.list()` keeps
// falling back to the `category-store.js` seed/mock otherwise.
const refreshCategoriesFromBackend = async () => {
  try {
    const categories = await backendCategories.list();
    if (Array.isArray(categories) && categories.length) {
      syncCategoriesFromBackend(categories);
    }
  } catch {
    // Backend unreachable or failing: keep the local mock catalog untouched.
  }
};

// Refreshes the locally cached article snapshot from the Flask backend's
// public read API. This writes into the content-store sync key so the
// placement-driven getters (getHeroArticle, getFeaturedStory, etc.) serve
// live backend data. The seeded mock cache is kept untouched for offline fallback.
const refreshArticlesFromBackend = async () => {
  try {
    const articles = await backendArticles.list();
    if (Array.isArray(articles) && articles.length) {
      syncArticlesFromBackend(articles);
    }
  } catch {
    // Backend unreachable or failing: keep the local mock article cache untouched.
  }
};

const resolveCompanyUserEmail = () => {
  const cached = getCachedBackendUser();
  if (cached?.email) return cached.email;
  const sessionUser = getCurrentSessionUser("reader");
  if (sessionUser?.email) return sessionUser.email;
  return appParams.businessEmail;
};

const syncBusinessCompanySnapshot = async () => {
  try {
    const entity = await backendCompanies.getBusinessCompany();
    // Preserve a successful `null` response too. It means the authenticated
    // business user has no company application, which must not be replaced by
    // an earlier cached company or the offline demo record.
    writeJson(companySyncKey, { source: "backend", entity });
    return entity;
  } catch {
    // Backend unreachable or failing: use the user-scoped mock snapshot.
    return getBusinessCompanySnapshot(resolveCompanyUserEmail());
  }
};

const syncAdminCompanyList = async () => {
  try {
    const companies = await backendCompanies.adminListCompanies();
    if (Array.isArray(companies)) {
      // An empty list is a successful, authoritative backend result. Caching
      // it prevents mock leads from inflating the admin Companies badge.
      writeJson(companyListSyncKey, companies);
    }
  } catch {
    // Backend unreachable or failing: keep the mock lead list.
  }
};

// Syncs the company snapshot (business users) or the full company list
// (admins) from the Flask backend, mirroring the plan/category/article
// refresh pattern. Server failures keep the local mock caches untouched so
// every accessor still falls back to the company-store offline.
const refreshCompanyFromBackend = async () => {
  if (!getAccessToken()) {
    return getBusinessCompanySnapshot(resolveCompanyUserEmail());
  }

  const cachedRole = getCachedBackendUser()?.role;

  if (cachedRole === "reader") {
    return getBusinessCompanySnapshot(resolveCompanyUserEmail());
  }

  if (cachedRole === "admin") {
    await syncAdminCompanyList();
    return getBusinessCompanySnapshot(resolveCompanyUserEmail());
  }

  return syncBusinessCompanySnapshot();
};

const requireAdmin = () => {
  const currentUser = getCurrentSessionUser("admin");
  if (!currentUser || currentUser.role !== "admin") {
    throw createAuthError("Admin access required", 403);
  }
  return currentUser;
};

const normalizeSubscriptionPlan = (plan) => ({
  ...plan,
  name: String(plan.name || "").trim(),
  price: String(plan.price || "").trim(),
  monthlyPrice:
    plan.price === "Custom" || plan.monthlyPrice === ""
      ? 0
      : Number(plan.monthlyPrice) || 0,
  yearlyPrice:
    plan.price === "Custom"
      ? 0
      : Number(plan.yearlyPrice ?? Number(plan.monthlyPrice || 0) * 12) || 0,
  description: String(plan.description || "").trim(),
  features: Array.isArray(plan.features)
    ? plan.features.map((feature) => String(feature).trim()).filter(Boolean)
    : [],
  audience: String(plan.audience || "").trim(),
  deliveryNote: String(plan.deliveryNote || "").trim(),
  paymentNote: String(plan.paymentNote || "").trim(),
});

const readUsers = () => {
  ensureSeedData();
  return readJson(usersKey, defaultUsers);
};

const writeUsers = (users) => {
  writeJson(usersKey, users);
};

const readSession = () => readJson(sessionKey, null);

const writeSession = (userId) => {
  writeJson(sessionKey, { userId });
};

const clearSession = () => {
  if (!storage) {
    return;
  }

  storage.removeItem(sessionKey);
};

const sanitizeUser = ({ password, ...user }) => user;

const getUserByEmail = (email) => {
  const users = readUsers();
  return users.find((user) => user.email === normalizeEmail(email)) ?? null;
};

const getUserById = (userId) => {
  const users = readUsers();
  return users.find((user) => user.id === userId) ?? null;
};

const getCurrentSessionUser = (fallbackRole) => {
  const session = readSession();

  if (session) {
    return getUserById(session.userId);
  }

  if (!fallbackRole) {
    return null;
  }

  const fallbackIds = {
    reader: "reader-1",
    business: "business-1",
    admin: "admin-1",
  };

  return getUserById(fallbackIds[fallbackRole] ?? fallbackIds.reader);
};

const updateStoredUser = (userId, updates) => {
  const users = readUsers();
  const nextUsers = users.map((user) =>
    user.id === userId ? { ...user, ...updates } : user,
  );
  writeUsers(nextUsers);
  return getUserById(userId);
};

const readGovernanceRequests = () => readJson(governanceRequestsKey, []);

export const getGovernanceActionCount = () =>
  readGovernanceRequests().filter(
    (request) => request.status !== "Completed",
  ).length;

const writeGovernanceRequests = (requests) => {
  writeJson(governanceRequestsKey, requests);
};

// Persist governance rows into the local cache so `getGovernanceActionCount`
// (used by the admin shell badge) reflects backend-synced data. Pass
// `{ replace: true }` for the authoritative admin queue; scoped lists and
// mutations merge by id so other scopes cached earlier are preserved.
const cacheGovernanceRequests = (rows, { replace = false } = {}) => {
  const incoming = Array.isArray(rows) ? rows.filter(Boolean) : [];

  if (replace) {
    writeGovernanceRequests(incoming);
    return incoming;
  }

  const merged = readGovernanceRequests().map((row) => ({ ...row }));
  incoming.forEach((row) => {
    const index = merged.findIndex((item) => item.id === row.id);
    if (index >= 0) {
      merged[index] = { ...merged[index], ...row };
    } else {
      merged.push(row);
    }
  });
  writeGovernanceRequests(merged);
  return merged;
};

const formatRequestDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

const enrichGovernanceRequest = (request) => {
  const user = getUserById(request.userId) || null;
  return {
    ...request,
    requester: {
      id: user?.id || request.userId,
      name: user?.name || "Unknown user",
      email: user?.email || "",
      role: user?.role || "",
      companyName: user?.companyName || "",
    },
    scopeLabel:
      request.scope === "company"
        ? user?.companyName || "Company account"
        : "Individual reader",
  };
};

const buildLoginUrl = (fromUrl) => {
  const loginUrl = new URL("/login", window.location.origin);

  if (fromUrl) {
    loginUrl.searchParams.set("from", fromUrl);
  }

  return loginUrl.toString();
};

ensureSeedData();
refreshPlansFromBackend();
refreshCategoriesFromBackend();
refreshArticlesFromBackend();
refreshCompanyFromBackend();

// Business shipment milestone transitions. Mirror the action maps in the
// business and admin shipment detail pages so the offline fallback behaves
// exactly like the live backend transition.
const BUSINESS_SHIPMENT_ADVANCES = {
  "Address review": { status: "Preparing", tone: "neutral" },
  Preparing: { status: "In dispatch", tone: "info" },
  "In dispatch": { status: "Delivered", tone: "success" },
};

const ADMIN_SHIPMENT_ADVANCES = {
  "Delay flagged": { status: "In dispatch", tone: "info" },
  Preparing: { status: "In dispatch", tone: "info" },
  "In dispatch": { status: "Delivered", tone: "success" },
};

const cacheLocation = (row) => {
  if (!row) return null;
  const current = getBusinessLocationRows();
  const next = current.some((item) => item.id === row.id)
    ? current.map((item) => (item.id === row.id ? { ...item, ...row } : item))
    : [...current, row];
  setBusinessLocationRows(next);
  return row;
};

const cacheBusinessShipment = (row) => {
  if (!row) return null;
  const current = getBusinessShipmentRows();
  const next = current.some((item) => item.id === row.id)
    ? current.map((item) => (item.id === row.id ? { ...item, ...row } : item))
    : [...current, row];
  setBusinessShipmentRows(next);
  return row;
};

const cacheAdminShipment = (row) => {
  if (!row) return null;
  const current = getAdminShipmentRows();
  const next = current.some((item) => item.id === row.id)
    ? current.map((item) => (item.id === row.id ? { ...item, ...row } : item))
    : [...current, row];
  setAdminShipmentRows(next);
  return row;
};

const cacheOrderPlan = (row) => {
  if (!row) return null;
  const current = getBusinessOrderRows();
  const next = current.some((item) => item.id === row.id)
    ? current.map((item) => (item.id === row.id ? { ...item, ...row } : item))
    : [...current, row];
  setBusinessOrderRows(next);
  return row;
};

const cacheInvoice = (row) => {
  if (!row) return null;
  const current = getBusinessInvoiceRows();
  const next = current.some((item) => item.id === row.id)
    ? current.map((item) => (item.id === row.id ? { ...item, ...row } : item))
    : [...current, row];
  setBusinessInvoiceRows(next);
  return row;
};

const fallbackShipmentActivity = (shipmentId, owner) => {
  if (!shipmentId) return [];
  const source =
    owner === "admin" ? adminShipmentActivityRows : businessShipmentActivityRows;
  return source.filter((row) => row.shipment === shipmentId);
};

// Offline checkout fallback: shapes a plausible succeeded session in the same
// contract as the backend so the success page + reader snapshot keep working
// when the Flask API is unreachable.
const buildOfflineCheckoutSession = ({
  plan,
  billingCycle = "monthly",
  paymentMethod = "card",
  customer,
  consents,
}) => {
  const normalizedCycle = billingCycle === "yearly" ? "yearly" : "monthly";
  const amount =
    normalizedCycle === "yearly"
      ? Number(plan?.yearlyPrice ?? Number(plan?.monthlyPrice || 0) * 12)
      : Number(plan?.monthlyPrice || 0);
  const formatQuoteDate = (date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);

  const nextChargeDate = new Date();
  nextChargeDate.setMonth(
    nextChargeDate.getMonth() + (normalizedCycle === "yearly" ? 12 : 1),
  );
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 14);
  const isPrint = plan?.id === "print-digital";

  return {
    id: `checkout-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "succeeded",
    subscriptionStatus: "active",
    statusMessage: "Payment confirmed and reader access activated.",
    plan: { ...plan, features: [...(plan?.features || [])] },
    quote: {
      amount,
      billingCycle: normalizedCycle,
      deliveryMode: isPrint
        ? "Biweekly print + digital"
        : "Digital access only",
      deliveryWindow: isPrint
        ? `Next delivery window opens ${formatQuoteDate(deliveryDate)}`
        : "No print shipment is scheduled for the digital-only plan.",
      nextChargeDate: formatQuoteDate(nextChargeDate),
    },
    customer,
    payment: {
      method: paymentMethod === "paypal" ? "PayPal" : "Card",
      reference: "",
    },
    consent: consents,
  };
};

export const appClient = {
  companyOrders: {
    estimateOrderPrice,

    list() {
      return readCompanyOrders();
    },

    async businessList() {
      try {
        const orders = await backendOrders.businessList();
        writeCompanyOrders(orders);
        return orders;
      } catch (error) {
        return readCompanyOrders();
      }
    },

    async businessCreate(data) {
      try {
        const order = await backendOrders.businessCreate(data);
        writeCompanyOrders([order, ...readCompanyOrders()]);
        return order;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        const snapshot = getBusinessCompanySnapshot(resolveCompanyUserEmail());
        const { total, rate } = estimateOrderPrice(data.copies);
        const order = normalizeCompanyOrder({
          id: `order-${Date.now()}`,
          companyAccountId: snapshot?.id || null,
          company: snapshot?.company || "",
          copies: Number(data.copies) || 0,
          neededBy: data.neededBy || "",
          deliveryLocations: data.deliveryLocations || [],
          articleId: data.articleId || null,
          articleTitle: data.articleTitle || "",
          estimatedPrice: total,
          rate,
          status: "Pending approval",
          tone: "warning",
          createdAt: new Date().toISOString(),
        });
        writeCompanyOrders([order, ...readCompanyOrders()]);
        return order;
      }
    },

    async adminList() {
      try {
        const orders = await backendOrders.adminList();
        writeCompanyOrders(orders);
        return orders;
      } catch (error) {
        return readCompanyOrders();
      }
    },

    async adminApprove(id, finalPrice) {
      try {
        const order = await backendOrders.adminApprove(id, finalPrice);
        writeCompanyOrders(
          readCompanyOrders().map((current) =>
            current.id === order.id ? order : current,
          ),
        );
        return order;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        const existing = readCompanyOrders().find(
          (current) => current.id === id,
        );
        if (!existing) {
          throw error;
        }
        const order = normalizeCompanyOrder({
          ...existing,
          status: "Approved",
          tone: "success",
          finalPrice: Number(finalPrice),
          reviewedAt: new Date().toISOString(),
        });
        writeCompanyOrders(
          readCompanyOrders().map((current) =>
            current.id === id ? order : current,
          ),
        );
        return order;
      }
    },

    async adminDecline(id) {
      try {
        const order = await backendOrders.adminDecline(id);
        writeCompanyOrders(
          readCompanyOrders().map((current) =>
            current.id === order.id ? order : current,
          ),
        );
        return order;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        const existing = readCompanyOrders().find(
          (current) => current.id === id,
        );
        if (!existing) {
          throw error;
        }
        const order = normalizeCompanyOrder({
          ...existing,
          status: "Declined",
          tone: "neutral",
          reviewedAt: new Date().toISOString(),
        });
        writeCompanyOrders(
          readCompanyOrders().map((current) =>
            current.id === id ? order : current,
          ),
        );
        return order;
      }
    },
  },
  businessTeam: {
    async list() {
      const currentUser = getCurrentSessionUser("business");
      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const members = await backendTeam.businessList();
        setBusinessTeamRows(members);
        return members;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return getBusinessTeamRows();
    },

    async activate(memberId) {
      const currentUser = getCurrentSessionUser("business");
      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const member = await backendTeam.businessActivate(memberId);
        const rows = getBusinessTeamRows();
        setBusinessTeamRows(
          rows.some((row) => row.id === member.id)
            ? rows.map((row) => (row.id === member.id ? member : row))
            : [...rows, member],
        );
        return member;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return updateBusinessTeamMember(memberId, {
        status: "Active",
        tone: "success",
      });
    },
  },
  subscriptions: {
    // Synchronous read from the local cache. The admin `refresh()` below keeps
    // that cache in step with the backend catalog.
    list() {
      return readSubscriptionPlans();
    },

    // Pulls the admin catalog (including business plans) into the cache so
    // every `useSubscriptionPlans()` consumer re-renders from server truth.
    async refresh() {
      try {
        const plans = await backendSubscriptions.adminList();
        if (Array.isArray(plans) && plans.length) {
          writeSubscriptionPlans(plans);
        }
        return plans;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return readSubscriptionPlans();
    },

    async update(planId, updates) {
      requireAdmin();

      try {
        const plan = await backendSubscriptions.adminUpdate(planId, updates);
        const plans = readSubscriptionPlans();
        writeSubscriptionPlans(
          plans.some((row) => row.id === plan.id)
            ? plans.map((row) => (row.id === plan.id ? plan : row))
            : [...plans, plan],
        );
        return plan;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const plans = readSubscriptionPlans();
      const existingPlan = plans.find((plan) => plan.id === planId);
      if (!existingPlan) {
        throw createAuthError("Subscription plan not found", 404);
      }

      const nextPlan = normalizeSubscriptionPlan({
        ...existingPlan,
        ...updates,
        id: existingPlan.id,
      });
      if (!nextPlan.name || !nextPlan.price) {
        throw createAuthError("Plan name and price are required", 400);
      }

      writeSubscriptionPlans(
        plans.map((plan) => (plan.id === planId ? nextPlan : plan)),
      );
      return nextPlan;
    },

    async create(plan) {
      requireAdmin();

      try {
        const created = await backendSubscriptions.adminCreate(plan);
        const plans = readSubscriptionPlans();
        writeSubscriptionPlans(
          plans.some((row) => row.id === created.id)
            ? plans.map((row) => (row.id === created.id ? created : row))
            : [...plans, created],
        );
        return created;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const nextPlan = normalizeSubscriptionPlan({
        ...plan,
        id: plan.id || `plan-${Date.now()}`,
      });
      if (!nextPlan.name || !nextPlan.price) {
        throw createAuthError("Plan name and price are required", 400);
      }

      writeSubscriptionPlans([...readSubscriptionPlans(), nextPlan]);
      return nextPlan;
    },

    async remove(planId) {
      requireAdmin();

      try {
        const plans = await backendSubscriptions.adminRemove(planId);
        writeSubscriptionPlans(plans);
        return plans;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const plans = readSubscriptionPlans();
      if (plans.length <= 1) {
        throw createAuthError("At least one subscription plan is required", 400);
      }

      const nextPlans = plans.filter((plan) => plan.id !== planId);
      writeSubscriptionPlans(nextPlans);
      return nextPlans;
    },

    async reset() {
      requireAdmin();

      try {
        const plans = await backendSubscriptions.adminReset();
        writeSubscriptionPlans(plans);
        return plans;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      writeSubscriptionPlans(defaultSubscriptionPlans);
      return defaultSubscriptionPlans;
    },
  },
  categories: {
    list() {
      const synced = readJson(categoriesSyncKey, null);
      if (Array.isArray(synced) && synced.length) {
        return synced;
      }
      return getCategories();
    },
    refresh() {
      return refreshCategoriesFromBackend();
    },
  },
  articles: {
    list() {
      return getAllArticles();
    },
    refresh() {
      return refreshArticlesFromBackend();
    },
  },
  locations: {
    list() {
      return getBusinessLocationRows();
    },

    getLocal(id) {
      return getBusinessLocationById(id);
    },

    async refresh() {
      try {
        const rows = await backendLocations.businessList();
        setBusinessLocationRows(rows);
        return rows;
      } catch (error) {
        return getBusinessLocationRows();
      }
    },

    async get(id) {
      try {
        const row = await backendLocations.businessGet(id);
        return cacheLocation(row);
      } catch (error) {
        if (isNetworkError(error)) {
          return getBusinessLocationById(id);
        }
        return null;
      }
    },

    async confirm(id) {
      try {
        const row = await backendLocations.businessConfirm(id);
        return cacheLocation(row);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        const existing = getBusinessLocationById(id);
        if (!existing) {
          throw error;
        }
        return cacheLocation({ ...existing, status: "Ready", tone: "success" });
      }
    },

    async create(data) {
      try {
        const row = await backendLocations.businessCreate(data);
        return cacheLocation(row);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        // Offline fallback: create a local record
        const snapshot = getBusinessCompanySnapshot(resolveCompanyUserEmail());
        const location = {
          id: `loc-${Date.now()}`,
          companyAccountId: snapshot?.id || null,
          location: data.location || "",
          region: data.region || "",
          address: data.address || data.location || "",
          placeId: data.placeId || "",
          latitude: data.latitude ?? null,
          longitude: data.longitude ?? null,
          copies: data.copies || "",
          contact: data.contact || "",
          status: "Review",
          tone: "warning",
          createdAt: new Date().toISOString(),
        };
        const current = getBusinessLocationRows();
        setBusinessLocationRows([location, ...current]);
        return location;
      }
    },
  },
  shipments: {
    list() {
      return getBusinessShipmentRows();
    },

    getLocal(id) {
      return getShipmentById(id);
    },

    async refresh() {
      try {
        const rows = await backendShipments.businessList();
        setBusinessShipmentRows(rows);
        return rows;
      } catch (error) {
        return getBusinessShipmentRows();
      }
    },

    async get(id) {
      try {
        const result = await backendShipments.businessGet(id);
        if (!result?.shipment) {
          return null;
        }
        cacheBusinessShipment(result.shipment);
        return result;
      } catch (error) {
        if (!isNetworkError(error)) {
          return null;
        }
        const shipment = getShipmentById(id);
        return shipment
          ? {
              shipment,
              activity: fallbackShipmentActivity(shipment.shipmentId, "business"),
            }
          : null;
      }
    },

    async advance(id) {
      try {
        const row = await backendShipments.businessAdvance(id);
        return cacheBusinessShipment(row);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        const existing = getShipmentById(id);
        const next = existing ? BUSINESS_SHIPMENT_ADVANCES[existing.status] : null;
        if (!existing || !next) {
          throw error;
        }
        return cacheBusinessShipment({ ...existing, ...next });
      }
    },

    listAdmin() {
      return getAdminShipmentRows();
    },

    async refreshAdmin() {
      try {
        const rows = await backendShipments.adminList();
        setAdminShipmentRows(rows);
        return rows;
      } catch (error) {
        return getAdminShipmentRows();
      }
    },

    async getAdmin(id) {
      try {
        const result = await backendShipments.adminGet(id);
        if (!result?.shipment) {
          return null;
        }
        cacheAdminShipment(result.shipment);
        return result;
      } catch (error) {
        if (!isNetworkError(error)) {
          return null;
        }
        const shipment = getShipmentById(id);
        return shipment
          ? {
              shipment,
              activity: fallbackShipmentActivity(shipment.shipmentId, "admin"),
            }
          : null;
      }
    },

    async advanceAdmin(id) {
      try {
        const row = await backendShipments.adminAdvance(id);
        return cacheAdminShipment(row);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        const existing = getShipmentById(id);
        const next = existing ? ADMIN_SHIPMENT_ADVANCES[existing.status] : null;
        if (!existing || !next) {
          throw error;
        }
        return cacheAdminShipment({ ...existing, ...next });
      }
    },
  },
  orderPlans: {
    list() {
      return getBusinessOrderRows();
    },

    getLocal(id) {
      return getBusinessOrderById(id);
    },

    async refresh() {
      try {
        const rows = await backendOrderPlans.businessList();
        setBusinessOrderRows(rows);
        return rows;
      } catch (error) {
        return getBusinessOrderRows();
      }
    },

    async get(id) {
      try {
        const plan = await backendOrderPlans.businessGet(id);
        if (!plan) {
          return null;
        }
        cacheOrderPlan(plan);
        return plan;
      } catch (error) {
        if (!isNetworkError(error)) {
          return null;
        }
        return getBusinessOrderById(id);
      }
    },

    async confirm(id) {
      try {
        const row = await backendOrderPlans.businessConfirm(id);
        return cacheOrderPlan(row);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        const existing = getBusinessOrderById(id);
        if (!existing || existing.status !== "Review") {
          throw error;
        }
        return cacheOrderPlan({ ...existing, status: "Active", tone: "success" });
      }
    },
  },
  invoices: {
    list() {
      return getBusinessInvoiceRows();
    },

    getLocal(id) {
      return getBusinessInvoiceById(id);
    },

    async refresh() {
      try {
        const rows = await backendInvoices.businessList();
        setBusinessInvoiceRows(rows);
        return rows;
      } catch (error) {
        return getBusinessInvoiceRows();
      }
    },

    async get(id) {
      try {
        const invoice = await backendInvoices.businessGet(id);
        if (!invoice) {
          return null;
        }
        cacheInvoice(invoice);
        return invoice;
      } catch (error) {
        if (!isNetworkError(error)) {
          return null;
        }
        return getBusinessInvoiceById(id);
      }
    },

    async confirm(id) {
      try {
        const row = await backendInvoices.businessConfirm(id);
        return cacheInvoice(row);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        const existing = getBusinessInvoiceById(id);
        if (!existing || existing.status !== "Review") {
          throw error;
        }
        return cacheInvoice({ ...existing, status: "Reviewed", tone: "info" });
      }
    },
  },
  auth: {
    async me() {
      const token = getAccessToken();

      if (token) {
        try {
          const user = await backendAuth.me();
          cacheBackendUser(user);
          return user;
        } catch (error) {
          if (isNetworkError(error)) {
            const cachedUser = getCachedBackendUser();
            if (cachedUser) {
              return cachedUser;
            }
          }
          throw error;
        }
      }

      const user = getCurrentSessionUser("reader");

      if (!user) {
        throw createAuthError("Authentication required", 401);
      }

      return sanitizeUser(user);
    },

    async login({ email, password, rememberMe }) {
      void rememberMe;
      try {
        const { accessToken, user } = await backendAuth.login({
          email,
          password,
        });
        saveAccessToken(accessToken);
        cacheBackendUser(user);
        await refreshPlansFromBackend();
        await refreshCategoriesFromBackend();
        await refreshArticlesFromBackend();
        await refreshCompanyFromBackend();
        return user;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const user = getUserByEmail(email);

      if (!user || user.password !== password) {
        throw createAuthError("Invalid email or password", 401);
      }

      writeSession(user.id);
      return sanitizeUser(user);
    },

    async register({
      name,
      email,
      password,
      role = "reader",
      accountType,
      companyName = "",
      licenseDocument = "",
      contactPhone = "",
      deliveryAddress = "",
      deliveryRegion = "",
      deliveryLocationName = "",
      geoapifyPlaceId = "",
      deliveryLatitude = null,
      deliveryLongitude = null,
    }) {
      try {
        const { accessToken, user, pendingApproval } = await backendAuth.register({
          name,
          email,
          password,
          role,
          accountType:
            accountType || (role === "business" ? "business" : "individual"),
          companyName,
          licenseDocument,
          contactPhone,
          deliveryAddress,
          deliveryRegion,
          deliveryLocationName,
          geoapifyPlaceId,
          deliveryLatitude,
          deliveryLongitude,
        });
        if (pendingApproval) {
          return { ...user, pendingApproval: true };
        }
        saveAccessToken(accessToken);
        cacheBackendUser(user);
        await refreshPlansFromBackend();
        await refreshCategoriesFromBackend();
        await refreshArticlesFromBackend();
        await refreshCompanyFromBackend();
        return user;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const normalizedEmail = normalizeEmail(email);
      const users = readUsers();
      const resolvedAccountType =
        accountType || (role === "business" ? "business" : "individual");

      if (users.some((user) => user.email === normalizedEmail)) {
        throw createAuthError("An account with that email already exists", 409);
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
        accountType: resolvedAccountType,
        companyName: companyName.trim() || null,
        contactPhone: contactPhone.trim() || null,
        deliveryAddress: deliveryAddress.trim() || null,
        city: deliveryRegion.trim() || null,
      };

      writeUsers([...users, newUser]);
      writeSession(newUser.id);

      return sanitizeUser(newUser);
    },

    async resetPasswordRequest(email) {
      const user = getUserByEmail(email);
      if (!user) {
        return { ok: true };
      }

      const resetTokens = readJson(resetTokensKey, {});
      resetTokens.demo = user.id;
      writeJson(resetTokensKey, resetTokens);

      return { ok: true, resetToken: "demo" };
    },

    async resetPassword({ resetToken, newPassword }) {
      const resetTokens = readJson(resetTokensKey, {});
      const userId = resetTokens[resetToken];

      if (!userId) {
        throw createAuthError("Invalid or expired reset link", 400);
      }

      const users = readUsers();
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, password: newPassword } : user,
      );

      writeUsers(updatedUsers);
      delete resetTokens[resetToken];
      writeJson(resetTokensKey, resetTokens);

      return { ok: true };
    },

    async updateProfile({
      name,
      contactPhone = "",
      deliveryAddress = "",
      city = "",
      postalCode = "",
      country = "",
    }) {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      const values = {
        name: name.trim(),
        contactPhone: contactPhone.trim() || null,
        deliveryAddress: deliveryAddress.trim() || null,
        city: city.trim() || null,
        postalCode: postalCode.trim() || null,
        country: country.trim() || null,
      };

      try {
        const user = await backendAuth.updateProfile(values);
        cacheBackendUser(user);
        updateStoredUser(currentUser.id, values);
        return user;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const updatedUser = updateStoredUser(currentUser.id, values);

      return sanitizeUser(updatedUser);
    },

    logout(redirectTo) {
      clearAccessToken();
      clearSession();
      if (storage) {
        storage.removeItem(companySyncKey);
        storage.removeItem(companyListSyncKey);
      }

      if (redirectTo && isBrowser) {
        window.location.assign(buildLoginUrl(redirectTo));
      }
    },

    redirectToLogin(fromUrl) {
      if (!isBrowser) {
        return;
      }

      window.location.assign(buildLoginUrl(fromUrl));
    },
  },
  account: {
    async getConsentSettings() {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const consents = await backendConsents.readerGet();
        return {
          newsletterOptIn: Boolean(consents.newsletterOptIn),
          privacyUpdatesOptIn:
            consents.privacyUpdatesOptIn === undefined
              ? true
              : Boolean(consents.privacyUpdatesOptIn),
          deliveryDataConsent:
            consents.deliveryDataConsent === undefined
              ? true
              : Boolean(consents.deliveryDataConsent),
        };
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return {
        newsletterOptIn: Boolean(currentUser.newsletterOptIn),
        privacyUpdatesOptIn:
          currentUser.privacyUpdatesOptIn === undefined
            ? true
            : Boolean(currentUser.privacyUpdatesOptIn),
        deliveryDataConsent:
          currentUser.deliveryDataConsent === undefined
            ? true
            : Boolean(currentUser.deliveryDataConsent),
      };
    },

    async saveConsentSettings({
      newsletterOptIn,
      privacyUpdatesOptIn,
      deliveryDataConsent,
    }) {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      const values = {
        newsletterOptIn: Boolean(newsletterOptIn),
        privacyUpdatesOptIn: Boolean(privacyUpdatesOptIn),
        deliveryDataConsent: Boolean(deliveryDataConsent),
      };

      try {
        const consents = await backendConsents.readerSave(values);
        return {
          newsletterOptIn: Boolean(consents.newsletterOptIn),
          privacyUpdatesOptIn:
            consents.privacyUpdatesOptIn === undefined
              ? values.privacyUpdatesOptIn
              : Boolean(consents.privacyUpdatesOptIn),
          deliveryDataConsent:
            consents.deliveryDataConsent === undefined
              ? values.deliveryDataConsent
              : Boolean(consents.deliveryDataConsent),
        };
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      updateStoredUser(currentUser.id, values);

      return values;
    },

    async listGovernanceRequests() {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const requests = await backendGovernance.readerList();
        cacheGovernanceRequests(requests);
        return requests;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return readGovernanceRequests().filter(
        (request) =>
          request.userId === currentUser.id && request.scope !== "company",
      );
    },

    async requestDataExport({ notes = "" } = {}) {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const request = await backendGovernance.readerCreate(
          "export",
          notes.trim(),
        );
        cacheGovernanceRequests([request]);
        return request;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const request = {
        id: `export-${Date.now()}`,
        userId: currentUser.id,
        scope: "reader",
        type: "Data export",
        status: "Queued",
        date: formatRequestDate(new Date()),
        createdAt: new Date().toISOString(),
        notes: notes.trim() || "Full account and subscription export requested.",
      };

      cacheGovernanceRequests([request]);
      return request;
    },

    async requestDeletion({ reason = "" } = {}) {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const request = await backendGovernance.readerCreate(
          "deletion",
          reason.trim(),
        );
        cacheGovernanceRequests([request]);
        return request;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const request = {
        id: `deletion-${Date.now()}`,
        userId: currentUser.id,
        scope: "reader",
        type: "Deletion review",
        status: "Review required",
        date: formatRequestDate(new Date()),
        createdAt: new Date().toISOString(),
        notes:
          reason.trim() ||
          "Account deletion review requested under the privacy workflow.",
      };

      cacheGovernanceRequests([request]);
      return request;
    },
  },
  company: {
    snapshot() {
      const synced = readJson(companySyncKey, null);
      if (
        synced &&
        typeof synced === "object" &&
        Object.prototype.hasOwnProperty.call(synced, "source") &&
        Object.prototype.hasOwnProperty.call(synced, "entity")
      ) {
        return synced.entity;
      }
      // Accept pre-TASK-120 cache entries during the one-time cache migration.
      if (synced) return synced;
      return getBusinessCompanySnapshot(resolveCompanyUserEmail());
    },

    list() {
      const synced = readJson(companyListSyncKey, null);
      if (Array.isArray(synced)) {
        return synced.filter(
          (entity) => getCompanyWorkflowState(entity) === "License submitted",
        );
      }
      return getCompanyLeads();
    },

    async refresh() {
      return refreshCompanyFromBackend();
    },

    async overview() {
      try {
        const metrics = await backendBusinessOverview.get();
        if (Array.isArray(metrics) && metrics.length) {
          return metrics;
        }
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return businessOverviewMetrics;
    },

    async getPrivacySettings() {
      const currentUser = getCurrentSessionUser("business");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const consents = await backendConsents.companyGet();
        return {
          commercialUpdatesOptIn: Boolean(consents.commercialUpdatesOptIn),
          privacyUpdatesOptIn:
            consents.privacyUpdatesOptIn === undefined
              ? true
              : Boolean(consents.privacyUpdatesOptIn),
          deliveryDataConsent:
            consents.deliveryDataConsent === undefined
              ? true
              : Boolean(consents.deliveryDataConsent),
        };
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return {
        commercialUpdatesOptIn: Boolean(currentUser.commercialUpdatesOptIn),
        privacyUpdatesOptIn:
          currentUser.privacyUpdatesOptIn === undefined
            ? true
            : Boolean(currentUser.privacyUpdatesOptIn),
        deliveryDataConsent:
          currentUser.deliveryDataConsent === undefined
            ? true
            : Boolean(currentUser.deliveryDataConsent),
      };
    },

    async savePrivacySettings({
      commercialUpdatesOptIn,
      privacyUpdatesOptIn,
      deliveryDataConsent,
    }) {
      const currentUser = getCurrentSessionUser("business");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      const values = {
        commercialUpdatesOptIn: Boolean(commercialUpdatesOptIn),
        privacyUpdatesOptIn: Boolean(privacyUpdatesOptIn),
        deliveryDataConsent: Boolean(deliveryDataConsent),
      };

      try {
        const consents = await backendConsents.companySave(values);
        return {
          commercialUpdatesOptIn: Boolean(consents.commercialUpdatesOptIn),
          privacyUpdatesOptIn:
            consents.privacyUpdatesOptIn === undefined
              ? values.privacyUpdatesOptIn
              : Boolean(consents.privacyUpdatesOptIn),
          deliveryDataConsent:
            consents.deliveryDataConsent === undefined
              ? values.deliveryDataConsent
              : Boolean(consents.deliveryDataConsent),
        };
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      updateStoredUser(currentUser.id, values);

      return values;
    },

    async listGovernanceRequests() {
      const currentUser = getCurrentSessionUser("business");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const requests = await backendGovernance.companyList();
        cacheGovernanceRequests(requests);
        return requests;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return readGovernanceRequests().filter(
        (request) =>
          request.userId === currentUser.id && request.scope === "company",
      );
    },

    async requestDataExport({ notes = "" } = {}) {
      const currentUser = getCurrentSessionUser("business");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const request = await backendGovernance.companyCreate(
          "export",
          notes.trim(),
        );
        cacheGovernanceRequests([request]);
        return request;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const request = {
        id: `company-export-${Date.now()}`,
        userId: currentUser.id,
        scope: "company",
        type: "Company data export",
        status: "Queued",
        date: formatRequestDate(new Date()),
        createdAt: new Date().toISOString(),
        notes:
          notes.trim() ||
          "Business account export requested for contacts, locations, and invoice-linked records.",
      };

      cacheGovernanceRequests([request]);
      return request;
    },

    async requestDeletion({ reason = "" } = {}) {
      const currentUser = getCurrentSessionUser("business");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const request = await backendGovernance.companyCreate(
          "deletion",
          reason.trim(),
        );
        cacheGovernanceRequests([request]);
        return request;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const request = {
        id: `company-deletion-${Date.now()}`,
        userId: currentUser.id,
        scope: "company",
        type: "Company deletion review",
        status: "Review required",
        date: formatRequestDate(new Date()),
        createdAt: new Date().toISOString(),
        notes:
          reason.trim() ||
          "Business account deletion or retention review requested under the company privacy workflow.",
      };

      cacheGovernanceRequests([request]);
      return request;
    },
  },
  reader: {
    async overview() {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      const local = getReaderSubscriptionSnapshot(currentUser.email);
      let snapshot = null;

      try {
        snapshot = await backendReader.overview();
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      if (!snapshot) {
        return local;
      }

      // The backend is the source of truth for seeded readers. A new reader
      // who checked out through the local mock has no subscription row yet
      // (only "No subscription"), so their local checkout must win until the
      // backend row exists.
      const backendKnowsNoSubscription = snapshot.planName === "No active plan";
      if (!backendKnowsNoSubscription || !local?.session) {
        return snapshot;
      }
      return local;
    },

    async deliveries() {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const rows = await backendReader.deliveries();
        if (Array.isArray(rows)) {
          return { current: rows[0] || null, history: rows.slice(1) };
        }
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return { current: getCurrentDelivery() || null, history: getRecentDeliveries() };
    },

    async deliveryDetail(trackingCode) {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        return await backendReader.deliveryGet(trackingCode);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const record = getDeliveryByTrackingCode(trackingCode);
      if (!record) {
        return { delivery: null, timeline: [] };
      }
      return { delivery: record, timeline: record.timeline || [] };
    },

    async history() {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const rows = await backendReader.history();
        if (Array.isArray(rows)) {
          return rows;
        }
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return getReadingHistoryRows();
    },

    async recordHistoryEvent(event) {
      const currentUser = getCurrentSessionUser("reader");
      if (!currentUser) {
        return;
      }
      try {
        await backendReader.recordHistoryEvent(event);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }
    },

    async billing() {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const rows = await backendReader.billing();
        if (Array.isArray(rows)) {
          return rows;
        }
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return getReaderBillingRows();
    },
  },
  checkout: {
    async availableMethods() {
      try {
        const methods = await backendPaymentMethods.list();
        if (Array.isArray(methods) && methods.length) {
          return methods;
        }
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return DEFAULT_PAYMENT_METHODS;
    },

    async create(data) {
      try {
        const session = await backendCheckout.create(data);
        if (session?.id) {
          saveCheckoutSession(session);
        }
        return session;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const session = buildOfflineCheckoutSession(data);
      saveCheckoutSession(session);
      return session;
    },

    async get(sessionId) {
      try {
        const session = await backendCheckout.get(sessionId);
        if (session?.id) {
          saveCheckoutSession(session);
        }
        return session;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const sessions = readCheckoutSessions();
      return sessions[sessionId] || null;
    },

    async confirm(sessionId, details) {
      try {
        const session = await backendCheckout.confirm(sessionId, details);
        if (session?.id) {
          saveCheckoutSession(session);
        }
        return session;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const sessions = readCheckoutSessions();
      const existing = sessions[sessionId];
      if (!existing) {
        return null;
      }

      const payment = { ...(existing.payment || {}) };
      if (details?.card?.number) {
        const digits = String(details.card.number).replace(/\D/g, "");
        payment.reference = digits.slice(-4);
        payment.method = "Card";
      }
      if (details?.paypalEmail) {
        payment.method = "PayPal";
        payment.reference = details.paypalEmail;
      }

      const session = {
        ...existing,
        status: "succeeded",
        subscriptionStatus: "active",
        statusMessage: "Payment confirmed and reader access activated.",
        payment,
      };
      saveCheckoutSession(session);
      return session;
    },
  },
  legal: {
    async get(key) {
      try {
        const page = await backendLegal.get(key);
        if (page) {
          saveLegalPage(page);
        }
        return page;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }
      return getLegalPage(key) || getDefaultLegalPage(key);
    },
  },
  admin: {
    async overview() {
      const currentUser = getCurrentSessionUser("admin");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const metrics = await backendAdminOverview.get();
        if (Array.isArray(metrics) && metrics.length) {
          return metrics;
        }
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return adminOverviewMetrics;
    },

    async listGovernanceRequests() {
      const currentUser = getCurrentSessionUser("admin");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const requests = await backendGovernance.adminList();
        cacheGovernanceRequests(requests, { replace: true });
        return requests;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      return readGovernanceRequests()
        .map(enrichGovernanceRequest)
        .sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime(),
        );
    },

    async updateGovernanceRequestStatus(requestId, nextStatus) {
      const currentUser = getCurrentSessionUser("admin");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
      }

      try {
        const updated = await backendGovernance.updateStatus(
          requestId,
          nextStatus,
        );
        cacheGovernanceRequests([updated]);
        return updated;
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
      }

      const requests = readGovernanceRequests();
      const index = requests.findIndex((request) => request.id === requestId);

      if (index < 0) {
        return null;
      }

      const updated = { ...requests[index], status: nextStatus };
      requests[index] = updated;
      writeGovernanceRequests(requests);
      return enrichGovernanceRequest(updated);
    },

    legal: {
      async list() {
        requireAdmin();

        try {
          const pages = await backendLegal.adminList();
          pages.forEach(saveLegalPage);
          return pages;
        } catch (error) {
          if (!isNetworkError(error)) {
            throw error;
          }
        }

        return LEGAL_PAGE_KEYS.map(
          (key) => getLegalPage(key) || getDefaultLegalPage(key),
        );
      },

      async update(key, updates) {
        requireAdmin();

        try {
          const page = await backendLegal.adminUpdate(key, updates);
          saveLegalPage(page);
          return page;
        } catch (error) {
          if (!isNetworkError(error)) {
            throw error;
          }
        }

        const current = getLegalPage(key) || getDefaultLegalPage(key);
        const page = toLegalPage({ ...current, ...updates, key });
        saveLegalPage(page);
        return page;
      },

      async reset(key) {
        requireAdmin();

        try {
          const page = await backendLegal.adminReset(key);
          saveLegalPage(page);
          return page;
        } catch (error) {
          if (!isNetworkError(error)) {
            throw error;
          }
        }

        const page = getDefaultLegalPage(key);
        saveLegalPage(page);
        return page;
      },
    },

    subscribers: {
      async list() {
        requireAdmin();

        try {
          const rows = await backendSubscribers.adminList();
          setSubscriberRows(rows);
          return rows;
        } catch (error) {
          if (!isNetworkError(error)) {
            throw error;
          }
        }

        return getSubscriberRows();
      },

      async get(id) {
        requireAdmin();

        try {
          const row = await backendSubscribers.adminGet(id);
          upsertSubscriber(row);
          return row;
        } catch (error) {
          if (!isNetworkError(error)) {
            throw error;
          }
        }

        return getSubscriberById(id);
      },

      async activate(id) {
        requireAdmin();

        try {
          const row = await backendSubscribers.adminActivate(id);
          upsertSubscriber(row);
          return row;
        } catch (error) {
          if (!isNetworkError(error)) {
            throw error;
          }
        }

        const existing = getSubscriberById(id);
        if (!existing) {
          throw createAuthError("Subscriber not found", 404);
        }

        const digitalOnly = existing.deliveryEligibility === "Digital only";
        return upsertSubscriber({
          ...existing,
          status: "Active",
          deliveryEligibility: digitalOnly ? "Digital only" : "Eligible",
          tone: digitalOnly ? "info" : "success",
        });
      },
    },
  },
};
