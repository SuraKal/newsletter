import { useStoreVersion } from "@/lib/store-bus";
import { appClient } from "@/api/appClient";
import { subscriptionPlans as fallbackPlans } from "@/lib/demoData";

export const useSubscriptionPlans = () => {
  useStoreVersion();
  const plans = appClient.subscriptions.list();
  return plans.length ? plans : fallbackPlans;
};

export const getReaderPlans = (plans) =>
  plans.filter(
    (plan) =>
      plan.id !== "business" &&
      !String(plan.id || "").startsWith("business"),
  );

export const getSubscriptionPrice = (plan, billingCycle = "monthly") => {
  if (!plan || plan.price === "Custom") {
    return 0;
  }

  return billingCycle === "yearly"
    ? Number(plan.yearlyPrice ?? Number(plan.monthlyPrice || 0) * 12)
    : Number(plan.monthlyPrice || 0);
};

const formatQuoteDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

export const getSubscriptionQuote = (
  plan,
  billingCycle = "monthly",
  referenceDate = new Date(),
) => {
  if (!plan) {
    return null;
  }

  const normalizedCycle = billingCycle === "yearly" ? "yearly" : "monthly";
  const amount = getSubscriptionPrice(plan, normalizedCycle);
  const nextChargeDate = new Date(referenceDate);
  nextChargeDate.setMonth(
    nextChargeDate.getMonth() + (normalizedCycle === "yearly" ? 12 : 1),
  );

  const deliveryDate = new Date(referenceDate);
  deliveryDate.setDate(deliveryDate.getDate() + 14);
  const hasPrintDelivery = plan.id === "print-digital";

  return {
    amount,
    billingCycle: normalizedCycle,
    deliveryMode: hasPrintDelivery
      ? "Biweekly print + digital"
      : "Digital access only",
    deliveryWindow: hasPrintDelivery
      ? `Next delivery window opens ${formatQuoteDate(deliveryDate)}`
      : "No print shipment is scheduled for the digital-only plan.",
    nextChargeDate: formatQuoteDate(nextChargeDate),
  };
};
