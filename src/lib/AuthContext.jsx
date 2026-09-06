import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { appClient } from "@/api/appClient";
import { appParams } from "@/lib/app-params";

const AuthContext = createContext(null);

export const authJourneyContent = {
  individual: {
    key: "individual",
    role: "reader",
    label: "Individual reader",
    shortLabel: "Reader",
    eyebrow: "Personal subscription",
    description:
      "Manage one subscriber account with reading history, payment records, and the next physical delivery from a single personal workspace.",
  },
  business: {
    key: "business",
    role: "business",
    label: "Company account",
    shortLabel: "Business",
    eyebrow: "Bulk orders and invoicing",
    description:
      "Set up a company account for multi-copy delivery, invoice-friendly billing, and shared shipment visibility across locations.",
  },
  admin: {
    key: "admin",
    role: "admin",
    label: "Admin operator",
    shortLabel: "Admin",
    eyebrow: "Internal operations",
    description:
      "Editorial and operational staff use the admin workspace to manage publishing, subscribers, companies, and active routes.",
  },
};

export const getJourneyFromRole = (role) => {
  if (role === "admin") {
    return "admin";
  }

  if (role === "business") {
    return "business";
  }

  return "individual";
};

export const getRoleFromJourney = (journey) => {
  if (journey === "admin") {
    return "admin";
  }

  if (journey === "business") {
    return "business";
  }

  return "reader";
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  const checkUserAuth = useCallback(async () => {
    try {
      setIsLoadingAuth(true);
      const currentUser = await appClient.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);

      if (appParams.authRequired && error.status === 401) {
        setAuthError({
          type: "auth_required",
          message: "Authentication required",
        });
      } else {
        setAuthError(null);
      }
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  const checkAppState = useCallback(async () => {
    setIsLoadingPublicSettings(true);
    setAppPublicSettings({
      id: appParams.storagePrefix,
      public_settings: {
        auth_required: appParams.authRequired,
        support_email: appParams.supportEmail,
        contact_phone: appParams.contactPhone,
      },
    });
    await checkUserAuth();
    setIsLoadingPublicSettings(false);
  }, [checkUserAuth]);

  useEffect(() => {
    checkAppState();
  }, [checkAppState]);

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(true);
    setAuthError(
      appParams.authRequired
        ? { type: "auth_required", message: "Authentication required" }
        : null,
    );

    if (shouldRedirect) {
      appClient.auth.logout(window.location.pathname + window.location.search);
    } else {
      appClient.auth.logout();
    }
  };

  const navigateToLogin = () => {
    appClient.auth.redirectToLogin(
      window.location.pathname + window.location.search,
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userJourney: user ? getJourneyFromRole(user.role) : null,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
        getJourneyFromRole,
        getRoleFromJourney,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
