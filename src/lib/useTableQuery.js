import { useEffect, useState } from "react";

export function useTableQuery({
  rows = [],
  query = "",
  predicate = (_row, _query) => true,
  pageSize = 5,
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const filteredRows = normalizedQuery
    ? rows.filter((row) => predicate(row, normalizedQuery))
    : rows;

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  useEffect(() => {
    setPage(1);
  }, [normalizedQuery]);

  const startOffset = (page - 1) * pageSize;
  const pagedRows = filteredRows.slice(startOffset, startOffset + pageSize);

  return {
    page,
    setPage,
    pageCount,
    pageSize,
    total: filteredRows.length,
    startOffset,
    endOffset: startOffset + pagedRows.length,
    rows: pagedRows,
  };
}