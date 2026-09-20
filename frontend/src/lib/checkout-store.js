import { appParams } from "@/lib/app-params";
import { notifyStoreChange } from "@/lib/store-bus";

export const checkoutStorageKey = `${appParams.storagePrefix}_checkout_sessions`;

export const readCheckoutSessions = () => {
  if (typeof window === "undefined") {
    return {};
  }

  const rawValue = window.localStorage.getItem(checkoutStorageKey);
  if (!rawValue) {
    return {};
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return {};
  }
};

export const writeCheckoutSessions = (sessions) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(checkoutStorageKey, JSON.stringify(sessions));
  notifyStoreChange(checkoutStorageKey);
};

export const saveCheckoutSession = (session) => {
  const sessions = readCheckoutSessions();
  sessions[session.id] = session;
  writeCheckoutSessions(sessions);
};

// Maps a backend checkout session payload onto the reader-checkout contract
// the success page and reader subscription snapshot consume. Legacy local
// sessions already match the contract and pass through unchanged.
export const toCheckoutSession = (sessionPayload) => {
  if (!sessionPayload || !sessionPayload.object) {
    return sessionPayload || null;
  }

  const delivery = sessionPayload.delivery || {};
  const isPaypal = sessionPayload.paymentMethod === "paypal";
  const brand = sessionPayload.cardBrand || "Card";
  const status = sessionPayload.status || "pending";
  const paymentStatus =
    status === "open" ? "pending" : ["succeeded", "cancelled", "expired"].includes(status) ? status : "pending";
  const succeeded = status === "succeeded";

  return {
    id: sessionPayload.id,
    createdAt: sessionPayload.createdAt || "",
    status: paymentStatus,
    subscriptionStatus: succeeded
      ? "active"
      : paymentStatus === "open"
        ? "pending"
        : "inactive",
    statusMessage: succeeded
      ? "Payment confirmed and reader access activated."
      : "",
    plan: sessionPayload.plan || {
      id: sessionPayload.planId,
      name: sessionPayload.planName || "Reader plan",
      features: [],
    },
    quote: sessionPayload.quote || {
      amount: sessionPayload.amount || 0,
      billingCycle: sessionPayload.billingCycle || "monthly",
      deliveryMode: "",
      deliveryWindow: "",
      nextChargeDate: "",
    },
    customer: {
      fullName: delivery.fullName || sessionPayload.customerName || "",
      email: delivery.email || sessionPayload.customerEmail || "",
      phone: delivery.phone || "",
      streetAddress: delivery.streetAddress || "",
      city: delivery.city || "",
      postalCode: delivery.postalCode || "",
      country: delivery.country || "",
    },
    payment: {
      method: isPaypal ? "PayPal" : brand,
      reference: isPaypal
        ? sessionPayload.paypalEmail || ""
        : sessionPayload.last4 || "",
    },
    consent: {
      recurringBilling: Boolean(sessionPayload.consents?.recurringBilling),
      deliverySharing: Boolean(sessionPayload.consents?.deliverySharing),
      newsletterOptIn: Boolean(sessionPayload.consents?.newsletterOptIn),
    },
  };
};