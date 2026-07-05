const getEnvBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  return value === "true";
};

const env = import.meta.env;

export const appConfig = {
  appName: env.VITE_APP_NAME || "Nequdem",
  authRequired: getEnvBoolean(env.VITE_AUTH_REQUIRED, false),
  storagePrefix: env.VITE_STORAGE_PREFIX || "nequdem",
  demoOtp: env.VITE_DEMO_OTP || "123456",
  admin: {
    email: env.VITE_ADMIN_EMAIL || "admin@nequdem.local",
    password: env.VITE_ADMIN_PASSWORD || "admin12345",
  },
  reader: {
    email: env.VITE_READER_EMAIL || "reader@nequdem.local",
    password: env.VITE_READER_PASSWORD || "reader12345",
  },
  business: {
    email: env.VITE_BUSINESS_EMAIL || "business@nequdem.local",
    password: env.VITE_BUSINESS_PASSWORD || "business12345",
  },
  google: {
    email: env.VITE_GOOGLE_DEMO_EMAIL || "google.user@nequdem.local",
    name: env.VITE_GOOGLE_DEMO_NAME || "Google Demo User",
  },
};
