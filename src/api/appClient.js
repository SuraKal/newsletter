import { appParams } from "@/lib/app-params";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const usersKey = `${appParams.storagePrefix}_users`;
const sessionKey = `${appParams.storagePrefix}_session`;
const resetTokensKey = `${appParams.storagePrefix}_reset_tokens`;
const governanceRequestsKey = `${appParams.storagePrefix}_governance_requests`;

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
};

const ensureSeedData = () => {
  if (!storage) {
    return;
  }

  const existingUsers = readJson(usersKey, []);
  const preservedUsers = existingUsers.filter(
    (user) =>
      user.id !== "admin-1" &&
      user.id !== "reader-1" &&
      user.id !== "business-1",
  );

  writeJson(usersKey, [...defaultUsers, ...preservedUsers]);

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
};

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

const writeGovernanceRequests = (requests) => {
  writeJson(governanceRequestsKey, requests);
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

export const appClient = {
  auth: {
    async me() {
      const user = getCurrentSessionUser("reader");

      if (!user) {
        throw createAuthError("Authentication required", 401);
      }

      return sanitizeUser(user);
    },

    async login({ email, password, rememberMe }) {
      void rememberMe;
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
      contactPhone = "",
      deliveryAddress = "",
    }) {
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

      const updatedUser = updateStoredUser(currentUser.id, {
        name: name.trim(),
        contactPhone: contactPhone.trim() || null,
        deliveryAddress: deliveryAddress.trim() || null,
        city: city.trim() || null,
        postalCode: postalCode.trim() || null,
        country: country.trim() || null,
      });

      return sanitizeUser(updatedUser);
    },

    logout(redirectTo) {
      clearSession();

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

      updateStoredUser(currentUser.id, {
        newsletterOptIn: Boolean(newsletterOptIn),
        privacyUpdatesOptIn: Boolean(privacyUpdatesOptIn),
        deliveryDataConsent: Boolean(deliveryDataConsent),
      });

      return {
        newsletterOptIn: Boolean(newsletterOptIn),
        privacyUpdatesOptIn: Boolean(privacyUpdatesOptIn),
        deliveryDataConsent: Boolean(deliveryDataConsent),
      };
    },

    async listGovernanceRequests() {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
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

      writeGovernanceRequests([...readGovernanceRequests(), request]);
      return request;
    },

    async requestDeletion({ reason = "" } = {}) {
      const currentUser = getCurrentSessionUser("reader");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
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

      writeGovernanceRequests([...readGovernanceRequests(), request]);
      return request;
    },
  },
  company: {
    async getPrivacySettings() {
      const currentUser = getCurrentSessionUser("business");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
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

      updateStoredUser(currentUser.id, {
        commercialUpdatesOptIn: Boolean(commercialUpdatesOptIn),
        privacyUpdatesOptIn: Boolean(privacyUpdatesOptIn),
        deliveryDataConsent: Boolean(deliveryDataConsent),
      });

      return {
        commercialUpdatesOptIn: Boolean(commercialUpdatesOptIn),
        privacyUpdatesOptIn: Boolean(privacyUpdatesOptIn),
        deliveryDataConsent: Boolean(deliveryDataConsent),
      };
    },

    async listGovernanceRequests() {
      const currentUser = getCurrentSessionUser("business");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
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

      writeGovernanceRequests([...readGovernanceRequests(), request]);
      return request;
    },

    async requestDeletion({ reason = "" } = {}) {
      const currentUser = getCurrentSessionUser("business");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
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

      writeGovernanceRequests([...readGovernanceRequests(), request]);
      return request;
    },
  },
  admin: {
    async listGovernanceRequests() {
      const currentUser = getCurrentSessionUser("admin");

      if (!currentUser) {
        throw createAuthError("Authentication required", 401);
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
  },
};
