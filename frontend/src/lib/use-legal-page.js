import { useEffect, useState } from "react";
import { appClient } from "@/api/appClient";
import { useStoreVersion } from "@/lib/store-bus";
import {
  getDefaultLegalPage,
  getLegalPage,
} from "@/lib/legal-store";

// Loads an admin-customizable legal page from the backend on mount. The page
// renders immediately from the cached/default content and is replaced by the
// backend copy when it arrives; a server rejection (unpublished/unknown key)
// surfaces as `notFound`.
export function useLegalPage(key) {
  useStoreVersion();
  const [page, setPage] = useState(
    () => getLegalPage(key) || getDefaultLegalPage(key),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setNotFound(false);

    appClient.legal
      .get(key)
      .then((loaded) => {
        if (cancelled) {
          return;
        }
        setPage(loaded);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        setNotFound(true);
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  return { page, isLoading, notFound };
}