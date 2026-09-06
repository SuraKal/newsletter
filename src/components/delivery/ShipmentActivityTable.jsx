import React from "react";
import {
  DashboardActivityTable,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";

const columns = [
  { key: "event", label: "Activity" },
  { key: "shipment", label: "Shipment" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "date", label: "Date" },
];

export default function ShipmentActivityTable({
  title,
  description,
  rows = [],
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
