import React from "react";
import { Outlet } from "react-router-dom";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default function ReaderDashboard() {
  return (
    <DashboardShell workspaceKey="reader">
      <Outlet />
    </DashboardShell>
  );
}
