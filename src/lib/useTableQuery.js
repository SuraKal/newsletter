import { useEffect, useState } from "react";

export function useTableFilters() {
  const [activeFilters, setActiveFilters] = useState({});

  const setFilter = (key, value) =>
    setActiveFilters((prev) => {
      const next = { ...prev };
      if (!value) {
        delete next[key];
      } else {
        next[key] = value;
      }
      return next;
    });

  const clearFilters = () => setActiveFilters({});

  return { activeFilters, setFilter, clearFilters };
}

export function useTableQuery({
  rows = [],
  query = "",
  predicate = (_row, _query) => true,
  pageSize = 5,
  activeFilters = {},
  filterGroups = [],
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const filterKey = filterGroups
    .map((group) => `${group.key}:${activeFilters[group.key] || ""}`)
    .join("|");

  const matchesFilters = (row) =>
    filterGroups.every((group) => {
      const selected = activeFilters[group.key];
      if (!selected) {
        return true;
      }
      return (
        String(row[group.key] ?? "")
          .trim()
          .toLowerCase() ===
        String(selected)
          .trim()
          .toLowerCase()
      );
    });

  const filteredRows = rows.filter(
    (row) =>
      (!normalizedQuery ? true : predicate(row, normalizedQuery)) &&
      matchesFilters(row),
  );

  const pageCount = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [page, pageCount]);

  useEffect(() => {
    setPage(1);
  }, [normalizedQuery, filterKey]);

  const startOffset = (page - 1) * pageSize;
  const pagedRows = filteredRows.slice(startOffset, startOffset + pageSize);

  const filterOptions = {};
  filterGroups.forEach((group) => {
    filterOptions[group.key] = Array.from(
      new Set(rows.map((row) => row[group.key]).filter(Boolean)),
    ).sort((a, b) => String(a).localeCompare(String(b)));
  });

  return {
    page,
    setPage,
    pageCount,
    pageSize,
    total: filteredRows.length,
    startOffset,
    endOffset: startOffset + pagedRows.length,
    rows: pagedRows,
    filterOptions,
    hasActiveFilters: Object.keys(activeFilters).some(
      (key) => Boolean(activeFilters[key]) && filterGroups.some((group) => group.key === key),
    ),
  };
}