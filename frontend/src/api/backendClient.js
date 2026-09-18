import { appParams } from "@/lib/app-params";
import { COMPANY_WORKFLOW_STATES } from "@/lib/company-store";

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

  async register({ name, email, password, role, companyName, accountType, licenseDocument }) {
    const payload = await request("/auth/register", {
      method: "POST",
      body: { name, email, password, role, companyName, accountType, licenseDocument },
      auth: false,
    });
    return { accessToken: payload.accessToken, user: toAppUser(payload.user), pendingApproval: Boolean(payload.pendingApproval) };
  },

  async me() {
    const payload = await request("/auth/me");
    return toAppUser(payload.user);
  },
};

export const backendSubscriptions = {
  async list() {
    const payload = await request("/subscriptions/plans", { auth: false });
    return (payload.plans || []).map(toAppPlan);
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
    return toAppCompany(payload.companyAccount);
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
    owner: shipment.owner || (hasCompany ? "business" : "admin"),
    company: shipment.company || "",
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
