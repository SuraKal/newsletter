import { useEffect, useState } from "react";
import { appClient } from "@/api/appClient";
import { subscriptionPlans as fallbackPlans } from "@/lib/demoData";

export const useSubscriptionPlans = () => {
  const [plans, setPlans] = useState(() => appClient.subscriptions.list());

  useEffect(() => {
    const refresh = () => setPlans(appClient.subscriptions.list());
    window.addEventListener("storage", refresh);
    window.addEventListener("nekedem:subscription-plans-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("nekedem:subscription-plans-updated", refresh);
    };
  }, []);

  return plans.length ? plans : fallbackPlans;
};

export const getReaderPlans = (plans) =>
  plans.filter((plan) => plan.id !== "business");
