import React from "react";
import {
  DashboardActivityTable,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";

const columns = [
  { key: "shipmentId", label: "Shipment" },
  { key: "label", label: "Account or run" },
  { key: "route", label: "Route" },
  { key: "scope", label: "Scope" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "eta", label: "ETA / window" },
];

export default function MultiShipmentTable({
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
