import React from "react";
import { Link } from "react-router-dom";
import {
  DashboardActivityTable,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";

const makeColumns = (trackingHref) => [
  { key: "edition", label: "Edition" },
  {
    key: "trackingId",
    label: "Tracking ID",
    render: (value, row) =>
      trackingHref ? (
        <Link
          to={trackingHref(row)}
          className="font-medium text-stone-900 transition-colors hover:text-heritage dark:text-stone-100"
        >
          {value}
        </Link>
      ) : (
        value
      ),
  },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "date", label: "Date" },
];

const matchesSearch = (row, query) =>
  [row.edition, row.trackingId, row.status, row.date].some((value) =>
    String(value ?? "").toLowerCase().includes(query),
  );

export default function DeliveryHistoryTable({
  title,
  description = null,
  rows,
  searchPlaceholder = "Search edition, tracking ID, or date",
  trackingHref = null,
}) {
  return (
    <DashboardActivityTable
      title={title}
      description={description}
      columns={makeColumns(trackingHref)}
      rows={rows}
      searchPlaceholder={searchPlaceholder}
      matchesSearch={matchesSearch}
    />
  );
}