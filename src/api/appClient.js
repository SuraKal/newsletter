import { appParams } from "@/lib/app-params";

const isBrowser = typeof window !== "undefined";
const storage = isBrowser ? window.localStorage : null;
const usersKey = `${appParams.storagePrefix}_users`;
const sessionKey = `${appParams.storagePrefix}_session`;
const resetTokensKey = `${appParams.storagePrefix}_reset_tokens`;

const defaultUsers = [
  {
    id: "admin-1",
    name: `${appParams.appName} Admin`,
    email: appParams.adminEmail,
    password: appParams.adminPassword,
    role: "admin",
  },
  {
    id: "reader-1",
    name: `${appParams.appName} Reader`,
    email: appParams.readerEmail,
    password: appParams.readerPassword,
    role: "reader",
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
  if (!storage || storage.getItem(usersKey)) {
    return;
  }

  writeJson(usersKey, defaultUsers);
  writeJson(resetTokensKey, {});
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
      const session = readSession();
      const user = session ? getUserById(session.userId) : null;

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

    async register({ name, email, password, role = "reader" }) {
      const normalizedEmail = normalizeEmail(email);
      const users = readUsers();

      if (users.some((user) => user.email === normalizedEmail)) {
        throw createAuthError("An account with that email already exists", 409);
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        role,
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
};
