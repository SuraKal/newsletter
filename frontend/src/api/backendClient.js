import { appParams } from "@/lib/app-params";
import { COMPANY_WORKFLOW_STATES } from "@/lib/company-store";
import { toCheckoutSession } from "@/lib/checkout-store";
import { toLegalPage } from "@/lib/legal-store";

// Re-exported so consumers can validate workflow states without importing the
// mock store directly.
export { COMPANY_WORKFLOW_STATES };

// Backend API client for the wired frontend blocks.
// Reaches the Flask API through the Vite `/api` proxy (see `frontend/vite.config.ts`).
// Blocks that are still mocked read from `appClient`/localStorage and do not
// call these helpers yet.

const API_BASE = "/api/v1";
const tokenKey = `${appParams.storagePrefix}_access_token`;
const backendUserCacheKey = `${appParams.storagePrefix}_backend_user`;

const isBrowser = typeof window !== "undefined";

export const getAccessToken = () =>
  isBrowser ? window.localStorage.getItem(tokenKey) : null;

export const saveAccessToken = (token) => {
  if (!isBrowser) {
    return;
  }
  window.localStorage.setItem(tokenKey, token);
};

export const clearAccessToken = () => {
  if (!isBrowser) {
    return;
  }
  window.localStorage.removeItem(tokenKey);
  window.localStorage.removeItem(backendUserCacheKey);
};

export const getCachedBackendUser = () => {
  if (!isBrowser) {
    return null;
  }
  try {
    return JSON.parse(window.localStorage.getItem(backendUserCacheKey)) || null;
  } catch {
    return null;
  }
};

export const cacheBackendUser = (user) => {
  if (!isBrowser || !user) {
    return;
  }
  window.localStorage.setItem(backendUserCacheKey, JSON.stringify(user));
};

// `fetch` network failures surface as TypeError. Server responses (even 4xx/5xx)
// are normal `Error`s with a `status`, so callers can tell "backend unreachable"
// apart from "backend answered with an error".
export const isNetworkError = (error) => error instanceof TypeError;

/**
 * @param {string} path
 * @param {{ method?: string, body?: unknown, auth?: boolean }} options
 */
const request = async (path, { method = "GET", body, auth = true } = {}) => {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.error || `Request failed (${response.status})`;
    /** @type {Error & { status?: number }} */
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
};

// Maps a backend user (with `subscriptions`) into the frontend user shape.
// Fields the local mock uses that the backend does not persist yet
// (contactPhone, deliveryAddress, consents, etc.) are simply absent.
export const toAppUser = (serverUser) => {
  const subscriptions = Array.isArray(serverUser.subscriptions)
    ? serverUser.subscriptions
    : [];
  return {
    id: String(serverUser.id),
    name: serverUser.name,
    email: serverUser.email,
    role: serverUser.role,
    accountType: serverUser.accountType,
    companyName: serverUser.companyName || null,
    businessAccessApproved: serverUser.businessAccessApproved !== false,
    contactPhone: serverUser.contactPhone || null,
    deliveryAddress: serverUser.deliveryAddress || null,
    city: serverUser.city || null,
    postalCode: serverUser.postalCode || null,
    country: serverUser.country || null,
    createdAt: serverUser.createdAt ?? null,
    subscriptions,
    subscription: subscriptions[0] || null,
  };
};

// Maps a backend plan into the shape the frontend catalog expects
// (mirrors `normalizeSubscriptionPlan` in `appClient.js`).
export const toAppPlan = (plan) => {
  const monthlyPrice = Number(plan.monthlyPrice ?? 0) || 0;
  const yearlyPrice = Number(plan.yearlyPrice ?? 0) || 0;
  return {
    id: plan.id,
    name: plan.name,
    price: monthlyPrice > 0 ? String(monthlyPrice) : "Custom",
    monthlyPrice,
    yearlyPrice,
    period: plan.period || "",
    description: plan.description || "",
    features: Array.isArray(plan.features) ? plan.features.map(String) : [],
    highlighted: Boolean(plan.highlighted),
    audience: plan.audience || "",
    deliveryNote: plan.deliveryNote || "",
    paymentNote: plan.paymentNote || "",
  };
};

export const backendAuth = {
  async login({ email, password }) {
    const payload = await request("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    });
    return { accessToken: payload.accessToken, user: toAppUser(payload.user), pendingApproval: Boolean(payload.pendingApproval) };
  },

  async register({
    name,
    email,
    password,
    role,
    companyName,
    accountType,
    licenseDocument,
    contactPhone,
    deliveryAddress,
    deliveryRegion,
    deliveryLocationName,
    geoapifyPlaceId,
    deliveryLatitude,
    deliveryLongitude,
  }) {
    const payload = await request("/auth/register", {
      method: "POST",
      body: {
        name,
        email,
        password,
        role,
        companyName,
        accountType,
        licenseDocument,
        contactPhone,
        deliveryAddress,
        deliveryRegion,
        deliveryLocationName,
        geoapifyPlaceId,
        deliveryLatitude,
        deliveryLongitude,
      },
      auth: false,
    });
    return { accessToken: payload.accessToken, user: toAppUser(payload.user), pendingApproval: Boolean(payload.pendingApproval) };
  },

  async me() {
    const payload = await request("/auth/me");
    return toAppUser(payload.user);
  },

  async updateProfile({
    name,
    contactPhone,
    deliveryAddress,
    city,
    postalCode,
    country,
  }) {
    const payload = await request("/auth/me", {
      method: "PUT",
      body: { name, contactPhone, deliveryAddress, city, postalCode, country },
    });
    return toAppUser(payload.user);
  },
};

export const backendSubscriptions = {
  async list() {
    const payload = await request("/subscriptions/plans", { auth: false });
    return (payload.plans || []).map(toAppPlan);
  },

  async adminList() {
    const payload = await request("/admin/subscriptions/plans");
    return (payload.plans || []).map(toAppPlan);
  },

  async adminCreate(data) {
    const payload = await request("/admin/subscriptions/plans", {
      method: "POST",
      body: data,
    });
    return toAppPlan(payload.plan);
  },

  async adminUpdate(planId, updates) {
    const payload = await request(
      `/admin/subscriptions/plans/${encodeURIComponent(planId)}`,
      { method: "PUT", body: updates },
    );
    return toAppPlan(payload.plan);
  },

  async adminRemove(planId) {
    const payload = await request(
      `/admin/subscriptions/plans/${encodeURIComponent(planId)}`,
      { method: "DELETE" },
    );
    return (payload.plans || []).map(toAppPlan);
  },

  async adminReset() {
    const payload = await request("/admin/subscriptions/plans/reset", {
      method: "POST",
    });
    return (payload.plans || []).map(toAppPlan);
  },
};

export const backendLegal = {
  async get(key) {
    const payload = await request(`/legal/${encodeURIComponent(key)}`, {
      auth: false,
    });
    return toLegalPage(payload.page);
  },

  async adminList() {
    const payload = await request("/admin/legal-pages");
    return (payload.pages || []).map(toLegalPage);
  },

  async adminUpdate(key, data) {
    const payload = await request(
      `/admin/legal-pages/${encodeURIComponent(key)}`,
      { method: "PUT", body: data },
    );
    return toLegalPage(payload.page);
  },

  async adminReset(key) {
    const payload = await request(
      `/admin/legal-pages/${encodeURIComponent(key)}/reset`,
      { method: "POST" },
    );
    return toLegalPage(payload.page);
  },
};

const ORDER_TONES = {
  "Pending approval": "warning",
  Approved: "success",
  Declined: "neutral",
};

export const toAppOrder = (order) => ({
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
  tone: ORDER_TONES[order.status] || "neutral",
  finalPrice: order.finalPrice == null ? null : Number(order.finalPrice),
  requestedBy: order.requestedBy ?? null,
  reviewedBy: order.reviewedBy ?? null,
  reviewedAt: order.reviewedAt || "",
  createdAt: order.createdAt || "",
  updatedAt: order.updatedAt || "",
});

export const backendOrders = {
  async businessList() {
    const payload = await request("/business/orders");
    return (payload.orders || []).map(toAppOrder);
  },

  async businessCreate(data) {
    const payload = await request("/business/orders", {
      method: "POST",
      body: data,
    });
    return toAppOrder(payload.order);
  },

  async adminList() {
    const payload = await request("/admin/orders");
    return (payload.orders || []).map(toAppOrder);
  },

  async adminApprove(id, finalPrice) {
    const payload = await request(`/admin/orders/${encodeURIComponent(id)}/approve`, {
      method: "POST",
      body: { finalPrice },
    });
    return toAppOrder(payload.order);
  },

  async adminDecline(id) {
    const payload = await request(`/admin/orders/${encodeURIComponent(id)}/decline`, {
      method: "POST",
      body: {},
    });
    return toAppOrder(payload.order);
  },
};

export const backendCategories = {
  async list() {
    const payload = await request("/categories", { auth: false });
    return payload.categories || [];
  },

  async get(idOrSlug) {
    const payload = await request(`/categories/${encodeURIComponent(idOrSlug)}`, { auth: false });
    return payload.category || null;
  },

  async adminCreate(data) {
    const payload = await request("/admin/categories", { method: "POST", body: data });
    return payload.category;
  },

  async adminUpdate(idOrSlug, data) {
    const payload = await request(`/admin/categories/${encodeURIComponent(idOrSlug)}`, {
      method: "PUT",
      body: data,
    });
    return payload.category;
  },

  async adminDelete(idOrSlug) {
    await request(`/admin/categories/${encodeURIComponent(idOrSlug)}`, { method: "DELETE" });
  },

  async adminReorder(idOrSlug, sortOrder) {
    const payload = await request(`/admin/categories/${encodeURIComponent(idOrSlug)}/order`, {
      method: "PUT",
      body: { sortOrder },
    });
    return payload.category;
  },
};

// Maps a backend article into the shape content-store consumers expect.
// The backend stores `body` as a single text blob and template extras in `meta`,
// so the mapper guarantees a string body and a flat object for template fields.
export const toAppArticle = (article) => ({
  id: article.id,
  headline: article.headline || "",
  summary: article.summary || "",
  body: Array.isArray(article.body)
    ? article.body.join("\n\n")
    : String(article.body || ""),
  image: article.image || null,
  author: article.author || "",
  editor: article.editor || "",
  status: article.status || "Draft",
  tone: article.tone || "neutral",
  source: article.source || "latest",
  categoryId: article.categoryId || null,
  categoryLabel: article.categoryLabel || "",
  readTime: article.readTime || "",
  accessLabel: article.accessLabel || "",
  publishDate: article.publishDate || "",
  publishTime: article.publishTime || "",
  clicks: Number(article.clicks) || 0,
  meta: article.meta && typeof article.meta === "object" ? article.meta : {},
});

export const backendArticles = {
  async list(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.source) query.set("source", params.source);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    const payload = await request(`/articles${suffix}`, { auth: false });
    return (payload.articles || []).map(toAppArticle);
  },

  async get(idOrSlug) {
    const payload = await request(`/articles/${encodeURIComponent(idOrSlug)}`, { auth: false });
    return payload.article ? toAppArticle(payload.article) : null;
  },

  async recordView(id) {
    await request(`/articles/${encodeURIComponent(id)}/view`, {
      method: "POST",
      auth: false,
    });
  },

  async adminList() {
    const payload = await request("/admin/articles");
    return (payload.articles || []).map(toAppArticle);
  },

  async adminCreate(data) {
    const payload = await request("/admin/articles", { method: "POST", body: data });
    return toAppArticle(payload.article);
  },

  async adminUpdate(id, data) {
    const payload = await request(`/admin/articles/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: data,
    });
    return toAppArticle(payload.article);
  },

  async adminDelete(id) {
    await request(`/admin/articles/${encodeURIComponent(id)}`, { method: "DELETE" });
  },

  async adminPublish(id) {
    const payload = await request(`/admin/articles/${encodeURIComponent(id)}/publish`, {
      method: "POST",
    });
    return toAppArticle(payload.article);
  },

  async adminUnpublish(id) {
    const payload = await request(`/admin/articles/${encodeURIComponent(id)}/unpublish`, {
      method: "POST",
    });
    return toAppArticle(payload.article);
  },
};

// Maps a backend company account into the mock entity shape consumers expect.
// The backend serializes the same camelCase fields, so this is mostly a shape
// guarantee plus workflow-state validation (unknown states fall back to "Draft").
export const toAppCompany = (company) => {
  const status = COMPANY_WORKFLOW_STATES.includes(company.status)
    ? company.status
    : "Draft";
  const quote =
    company.quote && company.quote !== "" && Object.keys(company.quote || {}).length
      ? company.quote
      : null;
  return {
    id: company.id,
    company: company.company || "Unnamed organization",
    volume: company.volume || "",
    billing: company.billing || "",
    status,
    region: company.region || "",
    ownerEmail: company.ownerEmail ?? null,
    ownerUserId: company.ownerUserId ?? null,
    workEmail: company.workEmail || "",
    lead: company.lead && typeof company.lead === "object" ? company.lead : {},
    quote,
    licenseDocument: company.licenseDocument ?? null,
    licenseReviewedAt: company.licenseReviewedAt ?? null,
    reviewedAt: company.reviewedAt ?? null,
    accountActivatedAt: company.accountActivatedAt ?? null,
    createdAt: company.createdAt ?? null,
  };
};

export const backendCompanies = {
  async getBusinessCompany() {
    const payload = await request("/business/company");
    return payload.companyAccount ? toAppCompany(payload.companyAccount) : null;
  },

  async getMyApplication(id) {
    const payload = await request(`/business/applications/${encodeURIComponent(id)}`);
    return payload.companyAccount ? toAppCompany(payload.companyAccount) : null;
  },

  async adminListCompanies() {
    const payload = await request("/admin/companies");
    return (payload.companyAccounts || []).map(toAppCompany);
  },

  async adminGetCompany(id) {
    const payload = await request(`/admin/companies/${encodeURIComponent(id)}`);
    return {
      ...toAppCompany(payload.companyAccount),
      locations: (payload.locations || []).map(toAppLocation),
    };
  },

  async adminApproveLicense(id) {
    return toAppCompany(
      (await request(`/admin/companies/${encodeURIComponent(id)}/approve-license`, {
        method: "POST",
      })).companyAccount,
    );
  },

  async adminDeclineLicense(id) {
    return toAppCompany(
      (await request(`/admin/companies/${encodeURIComponent(id)}/decline-license`, {
        method: "POST",
      })).companyAccount,
    );
  },
};

export const toAppLocation = (location) => ({
  id: location.id,
  companyAccountId: location.companyAccountId ?? null,
  location: location.location || "",
  region: location.region || "",
  copies: location.copies || "",
  contact: location.contact || "",
  address: location.address || "",
  placeId: location.placeId || "",
  latitude: location.latitude ?? null,
  longitude: location.longitude ?? null,
  status: location.status || "Review",
  tone: location.tone || "warning",
  createdAt: location.createdAt || "",
  updatedAt: location.updatedAt || "",
});

export const backendLocations = {
  async businessList() {
    const payload = await request("/business/locations");
    return (payload.locations || []).map(toAppLocation);
  },

  async businessGet(id) {
    const payload = await request(`/business/locations/${encodeURIComponent(id)}`);
    return payload.location ? toAppLocation(payload.location) : null;
  },

  async businessConfirm(id) {
    const payload = await request(
      `/business/locations/${encodeURIComponent(id)}/confirm`,
      { method: "POST", body: {} },
    );
    return toAppLocation(payload.location);
  },

  async businessCreate(data) {
    const payload = await request("/business/locations", {
      method: "POST",
      body: data,
    });
    return toAppLocation(payload.location);
  },
};

const SHIPMENT_TONES = {
  "Address review": "warning",
  Preparing: "neutral",
  "In dispatch": "info",
  Delivered: "success",
  "Delay flagged": "warning",
};

export const toAppShipment = (shipment) => {
  const hasCompany = Boolean(shipment.companyAccountId);
  return {
    id: shipment.id,
    companyAccountId: shipment.companyAccountId ?? null,
    shipmentId: shipment.shipmentId || "",
    label: shipment.label || "",
    route: shipment.route || "",
    scope: shipment.scope || "",
    status: shipment.status || "Preparing",
    tone: SHIPMENT_TONES[shipment.status] || shipment.tone || "neutral",
    eta: shipment.eta || "",
    sourceType: shipment.sourceType || "manual",
    orderRequestId: shipment.orderRequestId || null,
    notes: shipment.notes || "",
    owner: shipment.owner || (hasCompany ? "business" : "admin"),
    company: shipment.company || "",
    deliveryLocations: Array.isArray(shipment.deliveryLocations)
      ? shipment.deliveryLocations.map((location, index) =>
          typeof location === "string"
            ? {
                id: `dest-${index}`,
                location,
                address: "",
                region: "",
                copies: "",
                status: "Approved",
                tone: "success",
              }
            : toAppLocation(location),
        )
      : [],
    createdAt: shipment.createdAt || "",
    updatedAt: shipment.updatedAt || "",
  };
};

export const toAppShipmentActivity = (activity) => ({
  id: activity.id,
  event: activity.event || "",
  shipment: activity.shipmentId || "",
  status: activity.status || "",
  tone: activity.tone || "neutral",
  date: activity.date || "",
});

export const backendShipments = {
  async businessList() {
    const payload = await request("/business/shipments");
    return (payload.shipments || []).map(toAppShipment);
  },

  async businessGet(id) {
    const payload = await request(`/business/shipments/${encodeURIComponent(id)}`);
    if (!payload.shipment) return null;
    return {
      shipment: toAppShipment(payload.shipment),
      activity: (payload.activity || []).map(toAppShipmentActivity),
    };
  },

  async businessAdvance(id) {
    const payload = await request(
      `/business/shipments/${encodeURIComponent(id)}/advance`,
      { method: "POST", body: {} },
    );
    return toAppShipment(payload.shipment);
  },

  async adminList() {
    const payload = await request("/admin/shipments");
    return (payload.shipments || []).map(toAppShipment);
  },

  async adminGet(id) {
    const payload = await request(`/admin/shipments/${encodeURIComponent(id)}`);
    if (!payload.shipment) return null;
    return {
      shipment: toAppShipment(payload.shipment),
      activity: (payload.activity || []).map(toAppShipmentActivity),
    };
  },

  async adminAdvance(id) {
    const payload = await request(
      `/admin/shipments/${encodeURIComponent(id)}/advance`,
      { method: "POST", body: {} },
    );
    return toAppShipment(payload.shipment);
  },

  async businessCreate(data) {
    const payload = await request("/business/shipments", {
      method: "POST",
      body: data,
    });
    return toAppShipment(payload.shipment);
  },

  async adminCreate(data) {
    const payload = await request("/admin/shipments", {
      method: "POST",
      body: data,
    });
    return toAppShipment(payload.shipment);
  },
};

export const toAppOrderPlan = (plan) => ({
  id: plan.id,
  companyAccountId: plan.companyAccountId ?? null,
  order: plan.order || "",
  copies: plan.copies || "",
  cadence: plan.cadence || "",
  sites: plan.sites || "",
  status: plan.status || "Queued",
  tone: plan.tone || "neutral",
  nextWindow: plan.nextWindow || "",
  createdAt: plan.createdAt || "",
  updatedAt: plan.updatedAt || "",
});

export const backendOrderPlans = {
  async businessList() {
    const payload = await request("/business/order-plans");
    return (payload.orderPlans || []).map(toAppOrderPlan);
  },

  async businessGet(id) {
    const payload = await request(
      `/business/order-plans/${encodeURIComponent(id)}`,
    );
    return payload.orderPlan ? toAppOrderPlan(payload.orderPlan) : null;
  },

  async businessConfirm(id) {
    const payload = await request(
      `/business/order-plans/${encodeURIComponent(id)}/confirm`,
      { method: "POST", body: {} },
    );
    return toAppOrderPlan(payload.orderPlan);
  },
};

export const toAppInvoice = (invoice) => ({
  id: invoice.id,
  companyAccountId: invoice.companyAccountId ?? null,
  invoice: invoice.invoice || "",
  scope: invoice.scope || "",
  amount: invoice.amount || "",
  sourceType: invoice.sourceType || "",
  sourceId: invoice.sourceId || "",
  amountValue:
    invoice.amountValue != null ? Number(invoice.amountValue) : null,
  currency: invoice.currency || "EUR",
  status: invoice.status || "Upcoming",
  tone: invoice.tone || "neutral",
  date: invoice.date || "",
  createdAt: invoice.createdAt || "",
  updatedAt: invoice.updatedAt || "",
});

export const backendInvoices = {
  async businessList() {
    const payload = await request("/business/invoices");
    return (payload.invoices || []).map(toAppInvoice);
  },

  async businessGet(id) {
    const payload = await request(`/business/invoices/${encodeURIComponent(id)}`);
    return payload.invoice ? toAppInvoice(payload.invoice) : null;
  },

  async businessConfirm(id) {
    const payload = await request(
      `/business/invoices/${encodeURIComponent(id)}/confirm`,
      { method: "POST", body: {} },
    );
    return toAppInvoice(payload.invoice);
  },
};

// Business overview aggregates. The backend computes the "at a glance" metrics
// from orders, invoices, locations, shipments, and the active contract, then
// returns them in the display shape the overview page maps over.
const toAppOverviewMetric = (metric) => ({
  label: metric.label || "",
  value: metric.value || "",
  detail: metric.detail || "",
  accent: Boolean(metric.accent),
});

export const backendBusinessOverview = {
  async get() {
    const payload = await request("/business/overview");
    return (payload.metrics || []).map(toAppOverviewMetric);
  },
};

// Admin operations aggregates. Same display shape as the business overview;
// the backend computes the values across content, subscribers, companies, and
// shipments.
export const backendAdminOverview = {
  async get() {
    const payload = await request("/admin/overview");
    return (payload.metrics || []).map(toAppOverviewMetric);
  },

  async visibility() {
    const payload = await request("/admin/overview/visibility");
    return (payload.articles || []).map((row) => ({
      id: row.id,
      headline: row.headline || "",
      clicks: Number(row.clicks) || 0,
      status: row.status || "Draft",
    }));
  },
};

// Site settings. The public getter is unauthenticated (the home-page guide
// section reads it on load); the admin save is a guarded write.
export const backendSiteSettings = {
  async getUserGuideVideo() {
    const payload = await request("/settings/user-guide-video", { auth: false });
    return payload.video || null;
  },

  async updateUserGuideVideo(raw) {
    const payload = await request("/admin/settings/user-guide-video", {
      method: "PUT",
      body: { raw },
    });
    return payload.video || null;
  },
};

// Reader subscription snapshot. The backend derives every value from the
// caller's latest UserSubscription + plan + profile; the frontend passes the
// shape through untouched (mirrors `getReaderSubscriptionSnapshot`).
export const toReaderSnapshot = (snapshot) => ({
  planName: snapshot.planName || "No active plan",
  billingCycle: snapshot.billingCycle || "monthly",
  billingAmount: Number(snapshot.billingAmount ?? 0) || 0,
  nextBillingDate: snapshot.nextBillingDate || "Not scheduled",
  nextDeliveryDate: snapshot.nextDeliveryDate || "Not scheduled",
  paymentMethod: snapshot.paymentMethod || "No payment method",
  deliveryMode: snapshot.deliveryMode || "No delivery scheduled",
  deliveryWindow: snapshot.deliveryWindow || "Choose a plan to start delivery",
  subscriptionStatus: snapshot.subscriptionStatus || "No subscription",
  accessState: snapshot.accessState || "Public archive access only",
  recoveryAction: snapshot.recoveryAction || "Choose a reader plan",
  recoveryPath: snapshot.recoveryPath || "/subscriptions",
  hasReadingAccess: Boolean(snapshot.hasReadingAccess),
  hasDeliveryAccess: Boolean(snapshot.hasDeliveryAccess),
  isPrintSubscriber: Boolean(snapshot.isPrintSubscriber),
  locationSummary: snapshot.locationSummary || "Delivery profile saved",
});

export const backendReader = {
  async overview() {
    const payload = await request("/reader/overview");
    return toReaderSnapshot(payload.snapshot);
  },

  async deliveries() {
    const payload = await request("/reader/deliveries");
    return (payload.deliveries || []).map(toReaderDelivery);
  },

  async deliveryGet(key) {
    const payload = await request(
      `/reader/deliveries/${encodeURIComponent(key)}`,
    );
    return {
      delivery: payload.delivery ? toReaderDelivery(payload.delivery) : null,
      timeline: payload.timeline || [],
    };
  },

  async history() {
    const payload = await request("/reader/history");
    return (payload.history || []).map(toReadingHistoryRow);
  },

  async recordHistoryEvent(event) {
    const payload = await request("/reader/history", {
      method: "POST",
      body: event,
    });
    return (payload.history || []).map(toReadingHistoryRow);
  },

  async billing() {
    const payload = await request("/reader/billing");
    return (payload.entries || []).map(toBillingRow);
  },
};

// Public reader checkout. These routes are intentionally open so a guest can
// complete a subscription before creating an account; the confirm step creates
// or updates the reader user + subscription server-side.
export const backendPaymentMethods = {
  async list() {
    const payload = await request("/payment-methods", { auth: false });
    return Array.isArray(payload.methods) ? payload.methods : [];
  },
};

export const backendCheckout = {
  async stripeConfig() {
    const payload = await request("/stripe/config", { auth: false });
    return {
      enabled: Boolean(payload.enabled),
      publishableKey: payload.publishableKey || "",
    };
  },

  async create(data) {
    const payload = await request("/subscriptions/checkout", {
      method: "POST",
      body: data,
      auth: false,
    });
    return toCheckoutSession(payload.session);
  },

  async get(sessionId) {
    const payload = await request(
      `/subscriptions/checkout/${encodeURIComponent(sessionId)}`,
      { auth: false },
    );
    return toCheckoutSession(payload.session);
  },

  async confirm(sessionId, details) {
    const payload = await request(
      `/subscriptions/checkout/${encodeURIComponent(sessionId)}/confirm`,
      { method: "POST", body: details, auth: false },
    );
    return toCheckoutSession(payload.session);
  },
};

// Reader billing/payment events for the billing table. Mirrors the
// `readerBillingRows` demo contract (item, amount, status, tone, date);
// backend labels/amounts/statuses/tones/dates are derived server-side.
const toBillingRow = (row) => ({
  id: row.id || "",
  item: row.item || "Billing event",
  amount: row.amount || "—",
  status: row.status || "Pending",
  tone: row.tone || "neutral",
  date: row.date || "",
});

// Reading history rows for the reader history table. Mirrors the
// `readerHistoryRows` demo contract (articleId, item, category, status,
// tone, date); backend statuses/tone/dates are derived server-side.
const toReadingHistoryRow = (row) => ({
  id: row.id || "",
  articleId: row.articleId || "",
  item: row.item || "Untitled story",
  category: row.category || "News",
  status: row.status || "Viewed",
  tone: row.tone || "neutral",
  date: row.date || "",
});

// One print delivery for the reader deliveries table / hero / detail page.
// Mirrors the `readerDelivery*` demo contract (trackingId, edition, status,
// tone, eta, date, destination, note).
const toReaderDelivery = (row) => ({
  id: row.id || "",
  trackingId: row.trackingId || "",
  edition: row.edition || "",
  status: row.status || "",
  tone: row.tone || "neutral",
  eta: row.eta || "",
  date: row.date || "",
  destination: row.destination || "",
  note: row.note || "",
});

// Business team seats. Status is canonical ("Active"/"Pending"); the backend
// supplies the display tone so the roster table stays presentational.
export const toAppTeamMember = (member) => ({
  id: member.id,
  companyAccountId: member.companyAccountId ?? null,
  name: member.name || "",
  role: member.role || "",
  scope: member.scope || "",
  status: member.status || "Pending",
  tone: member.tone || "neutral",
  createdAt: member.createdAt || "",
  updatedAt: member.updatedAt || "",
});

export const backendTeam = {
  async businessList() {
    const payload = await request("/business/team");
    return (payload.teamMembers || []).map(toAppTeamMember);
  },

  async businessActivate(id) {
    const payload = await request(
      `/business/team/${encodeURIComponent(id)}/activate`,
      { method: "POST", body: {} },
    );
    return toAppTeamMember(payload.teamMember);
  },
};
// Consent preferences. The backend stores booleans and returns them under a
// `consents` key; the endpoint differs for reader (user) vs company accounts.
export const backendConsents = {
  async readerGet() {
    const payload = await request("/account/consents");
    return payload.consents || {};
  },

  async readerSave(values) {
    const payload = await request("/account/consents", {
      method: "PUT",
      body: values,
    });
    return payload.consents || {};
  },

  async companyGet() {
    const payload = await request("/business/company/consents");
    return payload.consents || {};
  },

  async companySave(values) {
    const payload = await request("/business/company/consents", {
      method: "PUT",
      body: values,
    });
    return payload.consents || {};
  },
};

// Maps a backend governance request into the shape the privacy/admin panels
// expect. Admin responses additionally carry `requester` and `scopeLabel`.
export const toAppGovernanceRequest = (row) => ({
  id: row.id,
  userId: row.userId ?? null,
  companyAccountId: row.companyAccountId ?? null,
  scope: row.scope || "reader",
  type: row.type || "",
  status: row.status || "Queued",
  tone: row.tone || "neutral",
  notes: row.notes || "",
  date: row.date || "",
  createdAt: row.createdAt || "",
  updatedAt: row.updatedAt || "",
  resolvedAt: row.resolvedAt || null,
  requester: row.requester || null,
  scopeLabel: row.scopeLabel || "",
});

export const backendGovernance = {
  async readerList() {
    const payload = await request("/account/governance-requests");
    return (payload.governanceRequests || []).map(toAppGovernanceRequest);
  },

  async companyList() {
    const payload = await request("/business/governance-requests");
    return (payload.governanceRequests || []).map(toAppGovernanceRequest);
  },

  async adminList() {
    const payload = await request("/admin/governance-requests");
    return (payload.governanceRequests || []).map(toAppGovernanceRequest);
  },

  async readerCreate(action, notes) {
    const payload = await request("/account/governance-requests", {
      method: "POST",
      body: { action, notes },
    });
    return toAppGovernanceRequest(payload.governanceRequest);
  },

  async companyCreate(action, notes) {
    const payload = await request("/business/governance-requests", {
      method: "POST",
      body: { action, notes },
    });
    return toAppGovernanceRequest(payload.governanceRequest);
  },

  async updateStatus(id, status) {
    const payload = await request(
      `/admin/governance-requests/${encodeURIComponent(id)}/status`,
      { method: "PUT", body: { status } },
    );
    return toAppGovernanceRequest(payload.governanceRequest);
  },
};

// Maps a backend subscriber row (reader user + latest subscription) into the
// shape `subscriber-store` and the admin subscriber pages read.
export const toAppSubscriber = (row) => ({
  id: String(row.id),
  name: row.name || "",
  email: row.email || "",
  plan: row.plan || "—",
  planId: row.planId ?? null,
  billingCycle: row.billingCycle || null,
  subscriptionId: row.subscriptionId ?? null,
  renewal: row.renewal || "—",
  deliveryEligibility: row.deliveryEligibility || "Eligible",
  status: row.status || "Active",
  tone: row.tone || "neutral",
});

export const backendSubscribers = {
  async adminList() {
    const payload = await request("/admin/subscribers");
    return (payload.subscribers || []).map(toAppSubscriber);
  },

  async adminGet(id) {
    const payload = await request(
      `/admin/subscribers/${encodeURIComponent(id)}`,
    );
    return toAppSubscriber(payload.subscriber);
  },

  async adminActivate(id) {
    const payload = await request(
      `/admin/subscribers/${encodeURIComponent(id)}/activate`,
      { method: "POST", body: {} },
    );
    return toAppSubscriber(payload.subscriber);
  },
};

export const backendPlaces = {
  async autocomplete(text) {
    const params = new URLSearchParams({ text });
    const payload = await request(`/places/autocomplete?${params.toString()}`, {
      auth: false,
    });
    return payload.features || [];
  },

  async detail(placeId) {
    const params = new URLSearchParams({ id: placeId });
    const payload = await request(`/places/detail?${params.toString()}`, {
      auth: false,
    });
    return payload;
  },

  async geocode(text) {
    const params = new URLSearchParams({ text });
    const payload = await request(`/places/geocode?${params.toString()}`, {
      auth: false,
    });
    return payload.features || [];
  },

  async reverse(lat, lon) {
    const params = new URLSearchParams({ lat: String(lat), lon: String(lon) });
    const payload = await request(`/places/reverse?${params.toString()}`, {
      auth: false,
    });
    return payload.features || [];
  },
};

export const backendMaps = {
  // Auth-required so the Geoapify tile key stays out of the public bundle.
  async config() {
    return request("/maps/config");
  },
};
