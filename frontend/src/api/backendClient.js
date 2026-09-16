import { appParams } from "@/lib/app-params";

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
    return { accessToken: payload.accessToken, user: toAppUser(payload.user) };
  },

  async register({ name, email, password, role, companyName, accountType }) {
    const payload = await request("/auth/register", {
      method: "POST",
      body: { name, email, password, role, companyName, accountType },
      auth: false,
    });
    return { accessToken: payload.accessToken, user: toAppUser(payload.user) };
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