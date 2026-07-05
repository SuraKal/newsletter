import { appConfig } from "@/lib/app-config";

const createMemoryStorage = () => {
  const data = new Map();

  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
};

const storage =
  typeof window === "undefined" ? createMemoryStorage() : window.localStorage;

const STORAGE_KEYS = {
  session: `${appConfig.storagePrefix}_auth_session`,
  users: `${appConfig.storagePrefix}_auth_users`,
  pendingRegistration: `${appConfig.storagePrefix}_pending_registration`,
  passwordResets: `${appConfig.storagePrefix}_password_resets`,
};

const normalizeEmail = (email) => String(email || "").trim().toLowerCase();

const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const readState = (key, fallback) => safeParse(storage.getItem(key), fallback);

const writeState = (key, value) => {
  storage.setItem(key, JSON.stringify(value));
};

const clearState = (key) => {
  storage.removeItem(key);
};

const createError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const buildUser = ({
  email,
  password,
  name,
  role,
  provider = "email",
  source = "local",
}) => ({
  email: normalizeEmail(email),
  password,
  name,
  role,
  provider,
  source,
});

const seedUsers = () => {
  const users = [
    buildUser({
      email: appConfig.admin.email,
      password: appConfig.admin.password,
      name: "Admin User",
      role: "admin",
      source: "seed",
    }),
    buildUser({
      email: appConfig.reader.email,
      password: appConfig.reader.password,
      name: "Reader User",
      role: "reader",
      source: "seed",
    }),
    buildUser({
      email: appConfig.business.email,
      password: appConfig.business.password,
      name: "Business User",
      role: "business",
      source: "seed",
    }),
    buildUser({
      email: appConfig.google.email,
      password: null,
      name: appConfig.google.name,
      role: "reader",
      provider: "google",
      source: "seed",
    }),
  ];

  return users.reduce((acc, user) => {
    acc[user.email] = user;
    return acc;
  }, {});
};

const getStoredUsers = () => readState(STORAGE_KEYS.users, {});

const saveStoredUsers = (users) => {
  writeState(STORAGE_KEYS.users, users);
};

const getUserDirectory = () => ({
  ...seedUsers(),
  ...getStoredUsers(),
});

const getUserByEmail = (email) => getUserDirectory()[normalizeEmail(email)] || null;

const createSession = (user) => {
  const session = {
    user: {
      email: user.email,
      name: user.name,
      role: user.role,
      provider: user.provider,
    },
  };

  writeState(STORAGE_KEYS.session, session);
  return {
    ...session,
    token: JSON.stringify(session),
  };
};

const clearSession = () => {
  clearState(STORAGE_KEYS.session);
};

const persistCustomUser = (user) => {
  const users = getStoredUsers();
  users[user.email] = user;
  saveStoredUsers(users);
};

const getSession = () => readState(STORAGE_KEYS.session, null);

const setSessionToken = (token) => {
  const parsed = safeParse(token, null);
  if (!parsed?.user) {
    throw createError("Invalid session token", 401);
  }
  writeState(STORAGE_KEYS.session, parsed);
  return parsed.user;
};

export const getCurrentUser = () => getSession()?.user || null;
export const getAuthSession = getSession;
export const clearAuthSession = clearSession;
export const setAuthSessionToken = setSessionToken;

export const authClient = {
  auth: {
    me: async () => {
      const session = getSession();
      if (!session?.user) {
        throw createError("Not authenticated", 401);
      }
      return session.user;
    },
    loginViaEmailPassword: async (email, password) => {
      const user = getUserByEmail(email);
      if (!user || user.password !== password) {
        throw createError("Invalid email or password", 401);
      }
      return createSession(user);
    },
    loginWithProvider: async (provider, redirectTo = "/") => {
      if (provider !== "google") {
        throw createError(`Unsupported provider: ${provider}`, 400);
      }

      const user =
        getUserByEmail(appConfig.google.email) ||
        buildUser({
          email: appConfig.google.email,
          password: null,
          name: appConfig.google.name,
          role: "reader",
          provider: "google",
          source: "seed",
        });

      createSession(user);

      if (typeof window !== "undefined" && redirectTo) {
        window.location.href = redirectTo;
      }

      return { user: getCurrentUser() };
    },
    register: async ({ email, password }) => {
      const normalizedEmail = normalizeEmail(email);
      if (getUserByEmail(normalizedEmail)) {
        throw createError("An account already exists with that email.", 400);
      }

      writeState(STORAGE_KEYS.pendingRegistration, {
        email: normalizedEmail,
        password,
        name: normalizedEmail.split("@")[0].replace(/[._-]+/g, " "),
        role: "reader",
        createdAt: Date.now(),
      });

      return { pending_verification: true };
    },
    verifyOtp: async ({ email, otpCode }) => {
      const pending = readState(STORAGE_KEYS.pendingRegistration, null);
      const normalizedEmail = normalizeEmail(email);

      if (!pending || pending.email !== normalizedEmail) {
        throw createError("No pending registration found for that email.", 400);
      }

      if (otpCode !== appConfig.demoOtp) {
        throw createError("Invalid verification code", 400);
      }

      const user = buildUser({
        email: pending.email,
        password: pending.password,
        name: pending.name || pending.email.split("@")[0],
        role: pending.role || "reader",
      });

      persistCustomUser(user);
      clearState(STORAGE_KEYS.pendingRegistration);

      const session = createSession(user);
      return { access_token: session.token, user: session.user };
    },
    resendOtp: async (email) => {
      const pending = readState(STORAGE_KEYS.pendingRegistration, null);
      if (!pending || pending.email !== normalizeEmail(email)) {
        throw createError("No pending registration found for that email.", 400);
      }

      return { sent: true };
    },
    resetPasswordRequest: async (email) => {
      const normalizedEmail = normalizeEmail(email);
      const user = getUserByEmail(normalizedEmail);

      const resetToken = JSON.stringify({
        email: normalizedEmail,
        issuedAt: Date.now(),
      });

      const resets = readState(STORAGE_KEYS.passwordResets, {});
      resets[resetToken] = {
        email: normalizedEmail,
        expiresAt: Date.now() + 30 * 60 * 1000,
      };
      writeState(STORAGE_KEYS.passwordResets, resets);

      return { sent: Boolean(user), resetToken };
    },
    resetPassword: async ({ resetToken, newPassword }) => {
      const resets = readState(STORAGE_KEYS.passwordResets, {});
      const resetRequest = resets[resetToken];

      if (!resetRequest || resetRequest.expiresAt < Date.now()) {
        throw createError("Invalid or expired reset token", 400);
      }

      const user = getUserByEmail(resetRequest.email);
      if (!user) {
        throw createError("Account not found", 404);
      }

      persistCustomUser({
        ...user,
        password: newPassword,
        source: "local",
      });

      delete resets[resetToken];
      writeState(STORAGE_KEYS.passwordResets, resets);

      return { success: true };
    },
    setToken: async (token) => setSessionToken(token),
    logout: async () => {
      clearSession();
    },
    redirectToLogin: (returnTo = "/login") => {
      if (typeof window !== "undefined") {
        window.location.href = returnTo;
      }
    },
  },
};
