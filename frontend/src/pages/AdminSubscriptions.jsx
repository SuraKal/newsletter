import React from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import DashboardSubscriptionCatalog from "@/components/dashboard/AdminSubscriptionCatalog";
import {
  DashboardPageHeader,
  DashboardPanel,
  DashboardRelatedLinks,
} from "@/components/dashboard/DashboardPrimitives";

const relatedLinks = [
  { label: "Subscribers", to: "/admin/subscribers" },
  { label: "Companies", to: "/admin/companies" },
  { label: "Company bulk pricing", to: "/admin/pricing" },
  { label: "Content", to: "/admin/content" },
];

export default function AdminSubscriptions() {
  return (
    <div className="space-y-6">
      <DashboardPageHeader
        eyebrow="Admin subscriptions"
        title="Reader subscription plans"
        description="Manage the individual reader plans shown on the public site, homepage, and checkout. Company accounts use the same reader access model when they subscribe, but their bulk ordering and invoicing rules stay in Pricing."
        breadcrumbs={[
          { label: "Admin workspace", to: "/admin/overview" },
          { label: "Subscriptions" },
        ]}
        action={
          <Link
            to="/admin/pricing"
            className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-stone-700 transition-colors hover:bg-stone-50"
          >
            Company bulk pricing
            <Building2 className="h-4 w-4" />
          </Link>
        }
      />

      <DashboardPanel
        title="Catalog boundary"
        description="Use this page for public reader access, plan messaging, and reader checkout. Use Pricing for company copy volume, contract bands, invoice handling, and delivery footprint."
        className="border-l-4 border-l-[#4A2A08]"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#4A2A08]">Reader subscriptions</p>
            <p className="mt-2 font-sans text-sm leading-5 text-stone-600">Digital access, print plus digital, and the public checkout experience.</p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-stone-700">Company bulk pricing</p>
            <p className="mt-2 font-sans text-sm leading-5 text-stone-600">Multiple copies, locations, negotiated bands, invoices, and shipment coordination.</p>
          </div>
        </div>
      </DashboardPanel>

      <DashboardSubscriptionCatalog />
      <DashboardRelatedLinks title="Related workspaces" items={relatedLinks} />
    </div>
  );
}
