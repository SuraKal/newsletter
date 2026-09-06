import React from "react";
import { Outlet } from "react-router-dom";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function BusinessDashboard() {
  return (
    <DashboardShell workspaceKey="business">
      <Outlet />
    </DashboardShell>
  );
}
