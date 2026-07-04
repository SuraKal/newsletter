import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Package,
  FileText,
  Truck,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "team", label: "Team", icon: Users },
  { id: "orders", label: "Orders", icon: Package },
  { id: "invoices", label: "Invoices", icon: FileText },
  { id: "tracking", label: "Tracking", icon: Truck },
  { id: "settings", label: "Settings", icon: Settings },
];

const teamMembers = [
  {
    name: "Robert Hale",
    email: "r.hale@meridian.com",
    role: "Admin",
    lastActive: "Today",
  },
  {
    name: "Sarah Lin",
    email: "s.lin@meridian.com",
    role: "Reader",
    lastActive: "Today",
  },
  {
    name: "James Wright",
    email: "j.wright@meridian.com",
    role: "Reader",
    lastActive: "Yesterday",
  },
  {
    name: "Maria Santos",
    email: "m.santos@meridian.com",
    role: "Reader",
    lastActive: "3 days ago",
  },
  {
    name: "Thomas Park",
    email: "t.park@meridian.com",
    role: "Reader",
    lastActive: "July 1, 2026",
  },
];

const invoices = [
  {
    id: "INV-2026-07",
    date: "July 1, 2026",
    amount: "$449.95",
    status: "Paid",
  },
  {
    id: "INV-2026-06",
    date: "June 1, 2026",
    amount: "$449.95",
    status: "Paid",
  },
  { id: "INV-2026-05", date: "May 1, 2026", amount: "$449.95", status: "Paid" },
];

export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="mb-6">
              <h2 className="font-heading text-lg font-bold text-ink">
                Meridian Holdings
              </h2>
              <p className="meta-text">Business Subscription</p>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 font-sans text-xs font-medium tracking-wider uppercase transition-colors text-left ${
                    activeTab === tab.id
                      ? "text-heritage bg-vellum"
                      : "text-redacted hover:text-ink hover:bg-vellum/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
              <div className="newspaper-rule my-2" />
              <Link
                to="/"
                className="w-full flex items-center gap-3 px-3 py-2.5 font-sans text-xs font-medium tracking-wider uppercase text-redacted hover:text-ink transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Link>
            </nav>
          </aside>

          {/* Content */}
          <div className="lg:col-span-4">
            {activeTab === "overview" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink">
                  Business Dashboard
                </h1>
                <p className="font-body text-sm text-redacted mt-1">
                  Meridian Holdings — Business Plan
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
                  {[
                    { label: "Active Seats", value: "5 / 25" },
                    { label: "Monthly Cost", value: "$449.95" },
                    { label: "Newspapers / Month", value: "50" },
                    { label: "Articles Read", value: "312" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="border border-stone-300/50 p-5"
                    >
                      <p className="font-sans text-xs font-bold tracking-widest uppercase text-redacted">
                        {s.label}
                      </p>
                      <p className="font-display text-xl font-bold text-ink mt-1">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink mb-4">
                      Recent Team Activity
                    </h3>
                    {teamMembers.slice(0, 3).map((m) => (
                      <div
                        key={m.email}
                        className="py-2.5 border-b border-stone-300/30 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-heading text-sm font-bold text-ink">
                            {m.name}
                          </p>
                          <p className="meta-text">{m.email}</p>
                        </div>
                        <span className="meta-text">{m.lastActive}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink mb-4">
                      Recent Invoices
                    </h3>
                    {invoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="py-2.5 border-b border-stone-300/30 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-heading text-sm font-bold text-ink">
                            {inv.id}
                          </p>
                          <p className="meta-text">{inv.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-body text-sm font-semibold text-ink">
                            {inv.amount}
                          </p>
                          <span className="font-sans text-xs font-bold tracking-wider uppercase text-green-700">
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h1 className="font-display text-2xl font-black text-ink">
                    Team Management
                  </h1>
                  <button className="font-sans text-xs font-bold tracking-wider uppercase bg-heritage text-paper px-4 py-2 hover:bg-ink transition-colors">
                    Add Member
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-ink">
                        <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                          Name
                        </th>
                        <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                          Email
                        </th>
                        <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                          Role
                        </th>
                        <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                          Last Active
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamMembers.map((m) => (
                        <tr
                          key={m.email}
                          className="border-b border-stone-300/30"
                        >
                          <td className="py-3 font-body text-sm font-semibold text-ink">
                            {m.name}
                          </td>
                          <td className="py-3 meta-text">{m.email}</td>
                          <td className="py-3">
                            <span className="font-sans text-xs font-bold tracking-wider uppercase text-heritage">
                              {m.role}
                            </span>
                          </td>
                          <td className="py-3 meta-text">{m.lastActive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-6">
                  Bulk Orders
                </h1>
                <div className="border border-stone-300/50 p-6">
                  <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink mb-2">
                    Current Order
                  </h3>
                  <p className="font-body text-sm text-redacted">
                    50 copies, biweekly delivery to 3 office locations
                  </p>
                  <p className="meta-text mt-2">Next delivery: July 18, 2026</p>
                </div>
              </div>
            )}

            {activeTab === "invoices" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-6">
                  Invoice History
                </h1>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-ink">
                        <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                          Invoice
                        </th>
                        <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                          Date
                        </th>
                        <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                          Amount
                        </th>
                        <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr
                          key={inv.id}
                          className="border-b border-stone-300/30"
                        >
                          <td className="py-3 font-body text-sm font-semibold text-ink">
                            {inv.id}
                          </td>
                          <td className="py-3 meta-text">{inv.date}</td>
                          <td className="py-3 font-body text-sm text-ink">
                            {inv.amount}
                          </td>
                          <td className="py-3">
                            <span className="font-sans text-xs font-bold tracking-wider uppercase text-green-700">
                              {inv.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "tracking" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-4">
                  Shipment Tracking
                </h1>
                <Link
                  to="/delivery"
                  className="font-sans text-xs font-bold tracking-wider uppercase text-heritage hover:text-ink transition-colors"
                >
                  Open Full Tracking →
                </Link>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-6">
                  Account Settings
                </h1>
                <div className="space-y-5 max-w-lg">
                  <div>
                    <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Meridian Holdings"
                      className="w-full bg-transparent border-b-2 border-stone-300 py-2 font-body text-sm text-ink focus:border-heritage outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                      Billing Email
                    </label>
                    <input
                      type="email"
                      defaultValue="accounts@meridian.com"
                      className="w-full bg-transparent border-b-2 border-stone-300 py-2 font-body text-sm text-ink focus:border-heritage outline-none"
                    />
                  </div>
                  <button className="font-sans text-xs font-bold tracking-wider uppercase bg-heritage text-paper px-6 py-3 hover:bg-ink transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
