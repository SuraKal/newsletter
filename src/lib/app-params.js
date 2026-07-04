const isBrowser = typeof window !== "undefined";
const env = /** @type {any} */ (import.meta).env || {};

const toBoolean = (value, fallback = false) => {
  if (value === undefined) {
    return fallback;
  }

  return value === "true";
};

export const appParams = {
  appName: env.VITE_APP_NAME || "ንቐደም",
  storagePrefix: env.VITE_STORAGE_PREFIX || "ንቐደም",
  authRequired: toBoolean(env.VITE_AUTH_REQUIRED, false),
  adminEmail: env.VITE_ADMIN_EMAIL || "admin@ንቐደም.local",
  adminPassword: env.VITE_ADMIN_PASSWORD || "admin12345",
  readerEmail: env.VITE_READER_EMAIL || "reader@ንቐደም.local",
  readerPassword: env.VITE_READER_PASSWORD || "reader12345",
  supportEmail: env.VITE_SUPPORT_EMAIL || "support@ንቐደም.local",
  contactPhone: env.VITE_CONTACT_PHONE || "+000000000000",
  googleDemoEmail: env.VITE_GOOGLE_DEMO_EMAIL || "google.user@ንቐደም.local",
  fromUrl: isBrowser ? window.location.href : "/",
};
