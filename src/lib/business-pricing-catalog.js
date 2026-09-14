import { useEffect, useState } from "react";
import { appClient } from "@/api/appClient";
import { businessPricingFramework as fallbackPricing } from "@/lib/demoData";

export const useBusinessPricing = () => {
  const [pricing, setPricing] = useState(() => appClient.businessPricing.list());

  useEffect(() => {
    const refresh = () => setPricing(appClient.businessPricing.list());
    window.addEventListener("storage", refresh);
    window.addEventListener("nekedem:business-pricing-updated", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("nekedem:business-pricing-updated", refresh);
    };
  }, []);

  return pricing.length ? pricing : fallbackPricing;
};
