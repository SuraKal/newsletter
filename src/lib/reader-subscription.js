import { appParams } from "@/lib/app-params";
import { notifyStoreChange } from "@/lib/store-bus";

const checkoutStorageKey = `${appParams.storagePrefix}_checkout_sessions`;
const lifecycleStateKey = `${appParams.storagePrefix}_reader_subscription_states`;

export const READER_SUBSCRIPTION_STATES = [
  "active",
  "trial",
  "paused",
  "cancelled",
  "past_due",
  "renewal_scheduled",
];

const readLifecycleStates = () => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    return JSON.parse(window.localStorage.getItem(lifecycleStateKey) || "{}");
  } catch {
    return {};
  }
};

export const setReaderSubscriptionState = (userEmail, state) => {
  if (typeof window === "undefined" || !userEmail) {
    return;
  }

  const normalizedState = READER_SUBSCRIPTION_STATES.includes(state)
    ? state
    : "active";
  const states = readLifecycleStates();
  states[userEmail.toLowerCase()] = normalizedState;
  window.localStorage.setItem(lifecycleStateKey, JSON.stringify(states));
  notifyStoreChange(lifecycleStateKey);
  window.dispatchEvent(new CustomEvent("nekedem:reader-subscription-updated"));
};

export const clearReaderSubscriptionState = (userEmail) => {
  if (typeof window === "undefined" || !userEmail) {
    return;
  }

  const states = readLifecycleStates();
  delete states[userEmail.toLowerCase()];
  window.localStorage.setItem(lifecycleStateKey, JSON.stringify(states));
  notifyStoreChange(lifecycleStateKey);
  window.dispatchEvent(new CustomEvent("nekedem:reader-subscription-updated"));
};

const getLifecycleState = (userEmail, checkoutSession) => {
  const override = userEmail
    ? readLifecycleStates()[userEmail.toLowerCase()]
    : null;
  if (override && READER_SUBSCRIPTION_STATES.includes(override)) {
    return override;
  }

  return checkoutSession?.subscriptionStatus || "active";
};

const hasReadingAccess = (state) =>
  ["active", "trial", "renewal_scheduled"].includes(state);

const getStatePresentation = (state, hasSession) => {
  if (!hasSession) {
    return {
      label: "No subscription",
      accessState: "Public archive access only",
      recoveryAction: "Choose a reader plan",
      recoveryPath: "/subscriptions",
    };
  }

  const presentations = {
    active: {
      label: "Active subscriber",
      accessState: "Recent reporting unlocked",
      recoveryAction: "Manage billing",
      recoveryPath: "/dashboard/billing",
    },
    trial: {
      label: "Trial access",
      accessState: "Recent reporting unlocked during trial",
      recoveryAction: "Choose a paid plan",
      recoveryPath: "/subscriptions",
    },
    paused: {
      label: "Subscription paused",
      accessState: "Recent reporting locked while paused",
      recoveryAction: "Resume subscription",
      recoveryPath: "/dashboard/billing",
    },
    cancelled: {
      label: "Subscription cancelled",
      accessState: "Public archive access only",
      recoveryAction: "Restart subscription",
      recoveryPath: "/subscriptions",
    },
    past_due: {
      label: "Payment needs attention",
      accessState: "Recent reporting locked until payment is resolved",
      recoveryAction: "Review payment",
      recoveryPath: "/dashboard/billing",
    },
    renewal_scheduled: {
      label: "Renewal scheduled",
      accessState: "Recent reporting unlocked until renewal",
      recoveryAction: "Review renewal",
      recoveryPath: "/dashboard/billing",
    },
  };

  return presentations[state] || presentations.active;
};

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
    .filter((session) => !session?.status || session.status === "succeeded")
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

  const snapshot = getReaderSubscriptionSnapshot(user.email);
  return snapshot.hasReadingAccess;
};

export const getReaderSubscriptionSnapshot = (userEmail) => {
  const checkoutSession = getLatestReaderCheckout(userEmail);

  if (!checkoutSession) {
    return {
      session: null,
      subscriptionStatus: "No subscription",
      planName: "No active plan",
      nextBillingDate: "Not scheduled",
      nextDeliveryDate: "Not scheduled",
      accessState: "Public archive access only",
      recoveryAction: "Choose a reader plan",
      recoveryPath: "/subscriptions",
      hasReadingAccess: false,
      hasDeliveryAccess: false,
      isPrintSubscriber: false,
      locationSummary: "No delivery profile",
      paymentMethod: "No payment method",
      deliveryMode: "No delivery scheduled",
      deliveryWindow: "Choose a plan to start delivery",
      billingCycle: "monthly",
      billingAmount: 0,
    };
  }

  const lifecycleState = getLifecycleState(userEmail, checkoutSession);
  const statePresentation = getStatePresentation(lifecycleState, true);
  const hasAccess = hasReadingAccess(lifecycleState);
  const hasDelivery = lifecycleState === "active" || lifecycleState === "trial" || lifecycleState === "renewal_scheduled";
  const nextDeliveryDate =
    checkoutSession.plan.id === "print-digital"
      ? checkoutSession.quote.deliveryWindow.replace("Next delivery window opens ", "")
      : "Digital-only plan";

  return {
    session: checkoutSession,
    subscriptionState: lifecycleState,
    subscriptionStatus: statePresentation.label,
    planName: checkoutSession.plan.name,
    nextBillingDate: checkoutSession.quote.nextChargeDate,
    nextDeliveryDate: hasDelivery ? nextDeliveryDate : "Not scheduled",
    accessState: statePresentation.accessState,
    recoveryAction: statePresentation.recoveryAction,
    recoveryPath: statePresentation.recoveryPath,
    hasReadingAccess: hasAccess,
    hasDeliveryAccess: hasDelivery,
    paymentMethod: checkoutSession.payment.method,
    deliveryMode: checkoutSession.quote.deliveryMode,
    deliveryWindow: hasDelivery
      ? checkoutSession.quote.deliveryWindow
      : "Delivery is unavailable until the subscription is active.",
    isPrintSubscriber: checkoutSession.plan.id === "print-digital" && hasDelivery,
    locationSummary:
      [checkoutSession.customer.city, checkoutSession.customer.country]
        .filter(Boolean)
        .join(", ") || "Delivery profile saved",
    billingCycle: checkoutSession.quote.billingCycle,
    billingAmount: checkoutSession.quote.amount,
  };
};
