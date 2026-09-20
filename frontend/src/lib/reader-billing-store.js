import { readerBillingRows } from "@/lib/demoData";

// Demo billing/payment events for the reader billing surface. Used as the
// offline fallback only once the backend billing route takes over.
export function getReaderBillingRows() {
  return readerBillingRows;
}