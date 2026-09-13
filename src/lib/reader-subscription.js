import { appParams } from "@/lib/app-params";
import { readerDashboardFallbackOverview } from "@/lib/demoData";

const checkoutStorageKey = `${appParams.storagePrefix}_checkout_sessions`;

export const readCheckoutSessions = () => {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = window.localStorage.getItem(checkoutStorageKey);
  if (!rawValue) {
    return [];
  }

  try {
    return Object.values(JSON.parse(rawValue));
  } catch {
    return [];
  }
};

export const getLatestReaderCheckout = (userEmail) => {
  const sessions = readCheckoutSessions()
    .filter((session) => session?.customer?.email)
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );

  if (!userEmail) {
    return sessions[0] || null;
  }

  return (
    sessions.find(
      (session) =>
        session.customer.email.toLowerCase() === userEmail.toLowerCase(),
    ) || null
  );
};

export const hasActiveReaderSubscription = (user) => {
  if (!user || user.role !== "reader") {
    return false;
  }

  return Boolean(getLatestReaderCheckout(user.email));
};

export const getReaderSubscriptionSnapshot = (userEmail) => {
  const checkoutSession = getLatestReaderCheckout(userEmail);

  if (!checkoutSession) {
    return {
      session: null,
      ...readerDashboardFallbackOverview,
      isPrintSubscriber: true,
      locationSummary: "Belgium and Germany rollout ready",
      billingCycle: "monthly",
      billingAmount: 24.99,
    };
  }

  const nextDeliveryDate =
    checkoutSession.plan.id === "print-digital"
      ? checkoutSession.quote.deliveryWindow.replace("Next delivery window opens ", "")
      : "Digital-only plan";

  return {
    session: checkoutSession,
    subscriptionStatus: "Active subscriber",
    planName: checkoutSession.plan.name,
    nextBillingDate: checkoutSession.quote.nextChargeDate,
    nextDeliveryDate,
    accessState:
      checkoutSession.plan.id === "print-digital"
        ? "Recent reporting unlocked"
        : "Digital subscriber access active",
    paymentMethod: checkoutSession.payment.method,
    deliveryMode: checkoutSession.quote.deliveryMode,
    deliveryWindow: checkoutSession.quote.deliveryWindow,
    isPrintSubscriber: checkoutSession.plan.id === "print-digital",
    locationSummary:
      [checkoutSession.customer.city, checkoutSession.customer.country]
        .filter(Boolean)
        .join(", ") || "Delivery profile saved",
    billingCycle: checkoutSession.quote.billingCycle,
    billingAmount: checkoutSession.quote.amount,
  };
};
