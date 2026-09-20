import { useEffect, useState } from "react";
import { appClient } from "@/api/appClient";
import { useStoreVersion } from "@/lib/store-bus";
import { getReaderSubscriptionSnapshot } from "@/lib/reader-subscription";

// Loads the reader subscription snapshot from the backend on mount and falls
// back to the local checkout-derived snapshot while in flight or offline.
// Re-renders on store changes so a profile save or reading-side mutation
// reflects immediately.
export function useReaderOverview(userEmail) {
  useStoreVersion();
  const [snapshot, setSnapshot] = useState(null);

  useEffect(() => {
    if (!userEmail) {
      return;
    }
    let cancelled = false;

    appClient.reader
      .overview()
      .then((nextSnapshot) => {
        if (!cancelled) {
          setSnapshot(nextSnapshot);
        }
      })
      .catch(() => {
        // Keep the local fallback snapshot on failure.
      });

    return () => {
      cancelled = true;
    };
  }, [userEmail]);

  return snapshot || getReaderSubscriptionSnapshot(userEmail);
}