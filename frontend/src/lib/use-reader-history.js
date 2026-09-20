import { useEffect, useState } from "react";

import { appClient } from "@/api/appClient";
import { getReadingHistoryRows } from "@/lib/reading-history";
import { useStoreVersion } from "@/lib/store-bus";

// Loads the signed-in reader's reading history from the Flask backend.
// Falls back to the local demo queue while the backend is unreachable so the
// surface stays fully interactive in the frontend-only workflow.
export function useReaderHistory() {
  useStoreVersion();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    let cancelled = false;
    appClient.reader
      .history()
      .then((historyRows) => {
        if (!cancelled) setRows(historyRows);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Backend contract is the source of truth once loaded; until then render
  // the same demo shape so the table never flashes empty.
  return rows || getReadingHistoryRows();
}