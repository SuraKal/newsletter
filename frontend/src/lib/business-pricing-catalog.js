import { useStoreVersion } from "@/lib/store-bus";
import { appClient } from "@/api/appClient";
import { businessPricingFramework as fallbackPricing } from "@/lib/demoData";

export const useBusinessPricing = () => {
  useStoreVersion();
  const pricing = appClient.businessPricing.list();
  return pricing.length ? pricing : fallbackPricing;
};
