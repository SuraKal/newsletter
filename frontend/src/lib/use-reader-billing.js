import { useEffect, useState } from "react";

import { appClient } from "@/api/appClient";
import { getReaderBillingRows } from "@/lib/reader-billing-store";
import { useStoreVersion } from "@/lib/store-bus";

// Loads the signed-in reader's billing/payment events from the Flask backend.
// Falls back to the local demo rows while the backend is unreachable so the
// surface stays fully interactive in the frontend-only workflow.
export function useReaderBilling() {
  useStoreVersion();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let cancelled = false;
    appClient.reader
      .billing()
      .then((billingRows) => {
        if (!cancelled) setRows(billingRows);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Backend contract is the source of truth once loaded; until then render
  // the same demo shape so the table never flashes empty.
  return rows || getReaderBillingRows();
}