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

export default function DeliveryHistoryTable({
  title,
  description = null,
  rows,
}) {
  return (
    <DashboardActivityTable
      title={title}
      description={description}
      columns={columns}
      rows={rows}
    />
  );
}
