import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, Truck } from "lucide-react";
import {
  DashboardFilterBar,
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import { adminCompanyRows } from "@/lib/demoData";

const companyColumns = [
  { key: "company", label: "Company" },
  { key: "tier", label: "Tier" },
  { key: "volume", label: "Volume" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
];

const relatedLinks = [
  { label: "Content", to: "/admin/content" },
  { label: "Schedule", to: "/admin/schedule" },
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Shipments", to: "/admin/shipments" },
  { label: "Pricing", to: "/admin/pricing" },
];

export default function AdminCompanies() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin companies"
        title="Company accounts"
        description="Review business account tiers and contract health."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Companies" },
        ]}
        action={
          <Link
            to="/admin/pricing"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Pricing tiers
            <CreditCard className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search company, contract tier, or invoice model"
        filters={["46 active companies", "Regional + enterprise tiers", "Belgium + Germany accounts"]}
        action={
          <Link
            to="/admin/shipments"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Delivery ops
            <Truck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel title="Company account table" className="p-5 sm:p-6">
        <div className="dashboard-table-wrap overflow-x-auto">
          <table className="w-full min-w-[620px]">
            <thead>
              <tr className="border-b border-stone-200/80 dark:border-stone-700/80">
                {companyColumns.map((column) => (
                  <th
                    key={column.key}
                    className="py-3 text-left font-sans text-[0.68rem] font-bold uppercase tracking-[0.18em] text-stone-500"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {adminCompanyRows.map((row) => (
                <tr key={row.id} className="border-b last:border-b-0">
                  {companyColumns.map((column) => (
                    <td
                      key={column.key}
                      className="py-3 font-sans text-sm text-stone-700 dark:text-stone-300"
                    >
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardPanel>

      <DashboardRelatedLinks title="Quick links" items={relatedLinks} />
    </div>
  );
}