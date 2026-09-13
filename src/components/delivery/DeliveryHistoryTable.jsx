import React from "react";
import {
  DashboardActivityTable,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";

const columns = [
  { key: "edition", label: "Edition" },
  { key: "trackingId", label: "Tracking ID" },
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
}) {
  return (
    <DashboardActivityTable
      title={title}
      description={description}
      columns={columns}
      rows={rows}
      searchPlaceholder={searchPlaceholder}
      matchesSearch={matchesSearch}
    />
  );
}
