import { useEffect, useState } from "react";
import { appClient } from "@/api/appClient";
import { useStoreVersion } from "@/lib/store-bus";
import {
  getCurrentDelivery,
  getDeliveryByTrackingCode,
  getRecentDeliveries,
} from "@/lib/delivery-store";

// Loads the reader's print deliveries from the backend on mount and falls
// back to the local delivery store while in flight or offline. `current` is
// the in-progress cycle, `history` the delivered editions behind it.
export function useReaderDeliveries() {
  useStoreVersion();
  const [deliveries, setDeliveries] = useState(null);

  useEffect(() => {
    let cancelled = false;

    appClient.reader
      .deliveries()
      .then((result) => {
        if (!cancelled) {
          setDeliveries(result);
        }
      })
      .catch(() => {
        // Keep the local fallback deliveries on failure.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!deliveries) {
    return {
      current: getCurrentDelivery() || null,
      history: getRecentDeliveries(),
    };
  }
  return deliveries;
}

// Loads one delivery record (with its timeline) by tracking code, falling
// back to the local delivery store while in flight or offline.
export function useReaderDeliveryDetail(trackingCode) {
  useStoreVersion();
  const [detail, setDetail] = useState(undefined);

  useEffect(() => {
    if (!trackingCode) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    setDetail(undefined);

    appClient.reader
      .deliveryDetail(trackingCode)
      .then((result) => {
        if (!cancelled) {
          setDetail(result);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetail(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [trackingCode]);

  if (detail === undefined) {
    const record = getDeliveryByTrackingCode(trackingCode);
    if (record) {
      return { delivery: record, timeline: record.timeline || [] };
    }
    return null;
  }
  return detail;
}