import React, { useState } from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import {
  Building2,
  Users,
  FileText,
  Truck,
  Package,
  CheckCircle,
  Clock,
  ArrowUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const tabs = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "subscriptions", label: "Subscriptions", icon: Users },
  { id: "orders", label: "Orders", icon: Package },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "tracking", label: "Tracking", icon: Truck },
  { id: "team", label: "Team", icon: Users },
];

const teamMembers = [
  {
    name: "Sarah Mitchell",
    email: "s.mitchell@acmecorp.com",
    role: "Admin",
    status: "Active",
  },
  {
    name: "David Park",
    email: "d.park@acmecorp.com",
    role: "Member",
    status: "Active",
  },
  {
    name: "Lisa Chen",
    email: "l.chen@acmecorp.com",
    role: "Member",
    status: "Active",
  },
  {
    name: "Robert Hayes",
    email: "r.hayes@acmecorp.com",
    role: "Member",
    status: "Invited",
  },
  {
    name: "Maria Gonzalez",
    email: "m.gonzalez@acmecorp.com",
    role: "Member",
    status: "Active",
  },
];

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageWrapper>
      <div className="nq-container py-10">
        <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground mb-8">
          <Link to="/" className="hover:text-heritage transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-heritage">Business Dashboard</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="nq-headline text-2xl md:text-4xl">
              Acme Corporation
            </h1>
            <p className="nq-deck mt-1">Business Ledger — 18 active seats</p>
          </div>
          <span className="bg-heritage text-parchment text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1">
            Enterprise
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-sans transition-colors text-left ${
                    activeTab === id
                      ? "bg-heritage text-parchment font-semibold"
                      : "text-ink hover:bg-vellum"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-4">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Active Seats",
                      value: "18 / 25",
                      change: "+2 this month",
                    },
                    {
                      label: "Monthly Spend",
                      value: "$1,242",
                      change: "Within budget",
                    },
                    {
                      label: "Newspapers Delivered",
                      value: "54",
                      change: "This quarter",
                    },
                    {
                      label: "Team Engagement",
                      value: "89%",
                      change: "+5% vs last month",
                    },
                  ].map(({ label, value, change }) => (
                    <div
                      key={label}
                      className="p-5 border border-rule nq-parchment"
                    >
                      <span className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground">
                        {label}
                      </span>
                      <div className="font-display text-2xl font-bold text-ink mt-1">
                        {value}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <ArrowUp className="w-3 h-3 text-heritage" />
                        <span className="font-sans text-[11px] text-heritage">
                          {change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Recent orders */}
                <div className="border border-rule p-6 nq-parchment">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                    Recent Orders
                  </h3>
                  <div className="space-y-3">
                    {[
                      {
                        id: "ORD-2026-0712",
                        date: "July 12, 2026",
                        qty: 18,
                        status: "Processing",
                      },
                      {
                        id: "ORD-2026-0628",
                        date: "June 28, 2026",
                        qty: 18,
                        status: "Delivered",
                      },
                      {
                        id: "ORD-2026-0614",
                        date: "June 14, 2026",
                        qty: 16,
                        status: "Delivered",
                      },
                    ].map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between py-3 border-b border-rule/50 last:border-0"
                      >
                        <div>
                          <p className="font-sans text-sm font-semibold text-ink">
                            {order.id}
                          </p>
                          <p className="font-sans text-xs text-muted-foreground">
                            {order.date} — {order.qty} copies
                          </p>
                        </div>
                        <span
                          className={`font-sans text-xs font-semibold ${order.status === "Delivered" ? "text-heritage" : "text-ink"}`}
                        >
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "subscriptions" && (
              <div className="space-y-6">
                <div className="p-8 nq-vellum border border-heritage">
                  <h3 className="font-display text-xl font-bold text-ink">
                    Business Ledger Plan
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground mt-1">
                    25 seats · Print + Digital · Biweekly delivery
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[
                      { label: "Per Seat", value: "$69.00" },
                      { label: "Total Monthly", value: "$1,242.00" },
                      { label: "Seats Used", value: "18 of 25" },
                      { label: "Renewal", value: "Aug 1, 2026" },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <span className="font-sans text-[11px] text-muted-foreground uppercase tracking-wider">
                          {label}
                        </span>
                        <p className="font-sans text-sm font-semibold text-ink mt-0.5">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="border border-rule p-6 nq-parchment">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage">
                    Team Members
                  </h3>
                  <button className="nq-btn-primary text-xs py-2 px-4">
                    Add Member
                  </button>
                </div>
                <div className="space-y-0">
                  <div className="grid grid-cols-4 gap-4 pb-3 border-b border-rule font-sans text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                    <span>Name</span>
                    <span>Email</span>
                    <span>Role</span>
                    <span>Status</span>
                  </div>
                  {teamMembers.map((m) => (
                    <div
                      key={m.email}
                      className="grid grid-cols-4 gap-4 py-3 border-b border-rule/50 last:border-0"
                    >
                      <span className="font-sans text-sm text-ink font-medium">
                        {m.name}
                      </span>
                      <span className="font-sans text-sm text-muted-foreground">
                        {m.email}
                      </span>
                      <span className="font-sans text-sm text-ink">
                        {m.role}
                      </span>
                      <span
                        className={`font-sans text-xs font-semibold ${m.status === "Active" ? "text-heritage" : "text-muted-foreground"}`}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "invoices" && (
              <div className="border border-rule p-6 nq-parchment">
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                  Invoice History
                </h3>
                <div className="space-y-0">
                  <div className="grid grid-cols-4 gap-4 pb-3 border-b border-rule font-sans text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                    <span>Invoice</span>
                    <span>Date</span>
                    <span>Amount</span>
                    <span>Status</span>
                  </div>
                  {[
                    {
                      id: "INV-2026-07",
                      date: "July 1, 2026",
                      amount: "$1,242.00",
                      status: "Paid",
                    },
                    {
                      id: "INV-2026-06",
                      date: "June 1, 2026",
                      amount: "$1,242.00",
                      status: "Paid",
                    },
                    {
                      id: "INV-2026-05",
                      date: "May 1, 2026",
                      amount: "$1,104.00",
                      status: "Paid",
                    },
                    {
                      id: "INV-2026-04",
                      date: "April 1, 2026",
                      amount: "$1,104.00",
                      status: "Paid",
                    },
                  ].map((inv) => (
                    <div
                      key={inv.id}
                      className="grid grid-cols-4 gap-4 py-3 border-b border-rule/50 last:border-0 items-center"
                    >
                      <span className="font-sans text-sm font-semibold text-ink">
                        {inv.id}
                      </span>
                      <span className="font-sans text-sm text-muted-foreground">
                        {inv.date}
                      </span>
                      <span className="font-sans text-sm text-ink">
                        {inv.amount}
                      </span>
                      <span className="font-sans text-xs text-heritage font-semibold">
                        {inv.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="border border-rule p-6 nq-parchment">
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                  Order History
                </h3>
                {[
                  {
                    id: "ORD-2026-0712",
                    date: "July 12, 2026",
                    copies: 18,
                    addresses: 3,
                    status: "Processing",
                  },
                  {
                    id: "ORD-2026-0628",
                    date: "June 28, 2026",
                    copies: 18,
                    addresses: 3,
                    status: "Delivered",
                  },
                  {
                    id: "ORD-2026-0614",
                    date: "June 14, 2026",
                    copies: 16,
                    addresses: 3,
                    status: "Delivered",
                  },
                  {
                    id: "ORD-2026-0531",
                    date: "May 31, 2026",
                    copies: 16,
                    addresses: 2,
                    status: "Delivered",
                  },
                ].map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-4 border-b border-rule/50 last:border-0"
                  >
                    <div>
                      <p className="font-sans text-sm font-semibold text-ink">
                        {order.id}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground">
                        {order.date} — {order.copies} copies to{" "}
                        {order.addresses} addresses
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.status === "Delivered" ? (
                        <CheckCircle className="w-4 h-4 text-heritage" />
                      ) : (
                        <Clock className="w-4 h-4 text-ink" />
                      )}
                      <span
                        className={`font-sans text-xs font-semibold ${order.status === "Delivered" ? "text-heritage" : "text-ink"}`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "tracking" && (
              <div className="space-y-4">
                {[
                  {
                    address: "Acme HQ — 200 Park Avenue, New York",
                    status: "In Transit",
                    eta: "July 12, 12:30 PM",
                  },
                  {
                    address: "Acme London — 1 Canada Square, Canary Wharf",
                    status: "Out for Delivery",
                    eta: "July 12, 10:00 AM",
                  },
                  {
                    address: "Acme SF — 555 Market Street, San Francisco",
                    status: "Off the Press",
                    eta: "July 12, 3:00 PM",
                  },
                ].map((loc) => (
                  <div
                    key={loc.address}
                    className="p-6 border border-rule nq-parchment flex items-center justify-between"
                  >
                    <div>
                      <p className="font-sans text-sm font-semibold text-ink">
                        {loc.address}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground">
                        ETA: {loc.eta}
                      </p>
                    </div>
                    <span className="text-[10px] font-sans bg-heritage/10 text-heritage px-2 py-1 font-bold uppercase tracking-wider">
                      {loc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
