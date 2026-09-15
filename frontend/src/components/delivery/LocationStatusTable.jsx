import React from "react";
import {
  DashboardActivityTable,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";

const columns = [
  { key: "location", label: "Location" },
  { key: "region", label: "Region" },
  { key: "copies", label: "Copies" },
  { key: "contact", label: "Receiving contact" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

export default function LocationStatusTable({
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
