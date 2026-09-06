import React from "react";
import { Link } from "react-router-dom";
import { MailPlus, ShieldCheck, Truck, Users } from "lucide-react";
import {
  DashboardActivityTable,
  DashboardFilterBar,
  DashboardMetricCard,
  DashboardPageHeader,
  DashboardPanel,
  DashboardStatusBadge,
} from "@/components/dashboard/DashboardPrimitives";
import {
  businessTeamInviteCards,
  businessTeamMetrics,
  businessTeamRows,
} from "@/lib/demoData";

const teamColumns = [
  { key: "name", label: "Team member" },
  { key: "role", label: "Role" },
  { key: "scope", label: "Scope" },
  {
    key: "status",
    label: "Status",
    render: (value, row) => (
      <DashboardStatusBadge label={value} tone={row.tone} />
    ),
  },
  { key: "updated", label: "Updated" },
];

export default function BusinessTeam() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Business team"
        title="Roles, seats, and operational access"
        description="Team membership should stay operational: who can approve invoices, who owns receiving coordination, and who needs access before the next business delivery cycle."
        action={
          <Link
            to="/business-dashboard/invoices"
            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-stone-700"
          >
            Open invoices
            <ShieldCheck className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardFilterBar
        searchPlaceholder="Search member, role, or location scope"
        filters={["12 active seats", "1 pending invite", "Ops + finance roles"]}
        action={
          <Link
            to="/business-dashboard/settings"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200/80 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Invite workflow
            <MailPlus className="h-4 w-4" />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {businessTeamMetrics.map((metric) => (
          <DashboardMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            accent={metric.accent}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <DashboardActivityTable
          title="Team access roster"
          description="Separate commercial, finance, and receiving roles so the account never depends on one person holding every responsibility."
          columns={teamColumns}
          rows={businessTeamRows}
        />
        <DashboardPanel
          title="Role and invitation guidance"
          description="Keep access rules visible so the team workspace does not turn into a generic member directory."
          className="h-full"
        >
          <div className="space-y-4">
            {businessTeamInviteCards.map((card) => (
              <div
                key={card.title}
                className="rounded-[1rem] border border-stone-200/80 bg-stone-50/80 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="dashboard-icon-badge flex h-10 w-10 items-center justify-center">
                    {card.icon === "receiving" ? (
                      <Truck className="h-4 w-4" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-stone-900 dark:text-stone-100">
                      {card.title}
                    </p>
                    <p className="dashboard-page-description mt-2 font-sans text-xs leading-5">
                      {card.detail}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </section>

    </div>
  );
}
