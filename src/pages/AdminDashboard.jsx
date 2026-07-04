import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PenLine,
  Calendar,
  Users,
  Building2,
  Truck,
  BarChart3,
  LogOut,
} from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "publish", label: "Publish", icon: PenLine },
  { id: "schedule", label: "Schedule", icon: Calendar },
  { id: "subscribers", label: "Subscribers", icon: Users },
  { id: "business", label: "Business Clients", icon: Building2 },
  { id: "delivery", label: "Delivery", icon: Truck },
];

const recentArticles = [
  {
    title: "Global Leaders Convene for Historic Climate Accord",
    author: "Sarah Whitfield",
    status: "Published",
    date: "July 4, 2026",
  },
  {
    title: "Senate Approves Sweeping Infrastructure Bill",
    author: "James Harrington",
    status: "Published",
    date: "July 4, 2026",
  },
  {
    title: "Central Banks Signal Coordinated Strategy",
    author: "Thomas Chen",
    status: "Scheduled",
    date: "July 5, 2026",
  },
  {
    title: "New Wave of Documentary Filmmaking",
    author: "Eleanor Vance",
    status: "Draft",
    date: "",
  },
];

export default function AdminDashboard() {
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
                Admin Panel
              </h2>
              <p className="meta-text">ንቐደም Publishing</p>
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
                  Editorial Dashboard
                </h1>
                <p className="font-body text-sm text-redacted mt-1">
                  Publishing overview for July 2026
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                  {[
                    { label: "Published Today", value: "12" },
                    { label: "Scheduled", value: "8" },
                    { label: "Total Subscribers", value: "24,318" },
                    { label: "Business Clients", value: "142" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="border border-stone-300/50 p-5"
                    >
                      <p className="font-sans text-xs font-bold tracking-widest uppercase text-redacted">
                        {s.label}
                      </p>
                      <p className="font-display text-2xl font-bold text-ink mt-1">
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink mb-4">
                    Recent Articles
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-ink">
                          <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                            Title
                          </th>
                          <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                            Author
                          </th>
                          <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                            Status
                          </th>
                          <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentArticles.map((a) => (
                          <tr
                            key={a.title}
                            className="border-b border-stone-300/30"
                          >
                            <td className="py-3 font-body text-sm text-ink max-w-xs truncate">
                              {a.title}
                            </td>
                            <td className="py-3 meta-text">{a.author}</td>
                            <td className="py-3">
                              <span
                                className={`font-sans text-xs font-bold tracking-wider uppercase ${
                                  a.status === "Published"
                                    ? "text-green-700"
                                    : a.status === "Scheduled"
                                      ? "text-blue-700"
                                      : "text-redacted"
                                }`}
                              >
                                {a.status}
                              </span>
                            </td>
                            <td className="py-3 meta-text">{a.date || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "publish" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-6">
                  Publish Article
                </h1>
                <div className="space-y-5 max-w-2xl">
                  <div>
                    <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      placeholder="Enter article headline"
                      className="w-full bg-transparent border-b-2 border-stone-300 py-2 font-display text-xl text-ink focus:border-heritage outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                        Category
                      </label>
                      <select className="w-full bg-transparent border-b-2 border-stone-300 py-2 font-body text-sm text-ink focus:border-heritage outline-none">
                        <option>Politics</option>
                        <option>Business</option>
                        <option>Economy</option>
                        <option>Technology</option>
                        <option>Sports</option>
                        <option>Culture</option>
                        <option>Events</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        placeholder="Author name"
                        className="w-full bg-transparent border-b-2 border-stone-300 py-2 font-body text-sm text-ink focus:border-heritage outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                      Summary
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Brief article summary"
                      className="w-full bg-transparent border-2 border-stone-300 p-3 font-body text-sm text-ink focus:border-heritage outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                      Article Body
                    </label>
                    <textarea
                      rows={10}
                      placeholder="Full article content"
                      className="w-full bg-transparent border-2 border-stone-300 p-3 font-body text-sm text-ink focus:border-heritage outline-none resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button className="font-sans text-xs font-bold tracking-wider uppercase bg-heritage text-paper px-6 py-3 hover:bg-ink transition-colors">
                      Publish Now
                    </button>
                    <button className="font-sans text-xs font-bold tracking-wider uppercase border-2 border-ink text-ink px-6 py-3 hover:bg-ink hover:text-paper transition-colors">
                      Save Draft
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-6">
                  Scheduled Articles
                </h1>
                {[
                  {
                    title: "Central Banks Signal Coordinated Strategy",
                    date: "July 5, 2026 · 6:00 AM",
                    author: "Thomas Chen",
                  },
                  {
                    title: "Renewable Energy Investment Report Q3",
                    date: "July 6, 2026 · 7:00 AM",
                    author: "Dr. Emily Rossini",
                  },
                ].map((a) => (
                  <div
                    key={a.title}
                    className="py-4 border-b border-stone-300/30 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-heading text-sm font-bold text-ink">
                        {a.title}
                      </p>
                      <p className="meta-text mt-0.5">By {a.author}</p>
                    </div>
                    <span className="font-sans text-xs text-blue-700 font-bold tracking-wider uppercase">
                      {a.date}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "subscribers" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-2">
                  Subscriber Management
                </h1>
                <p className="font-body text-sm text-redacted mb-6">
                  24,318 total subscribers
                </p>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Digital Only", value: "18,204" },
                    { label: "Print + Digital", value: "5,972" },
                    { label: "Business", value: "142 orgs" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="border border-stone-300/50 p-4"
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
              </div>
            )}

            {activeTab === "business" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-6">
                  Business Clients
                </h1>
                {[
                  {
                    name: "Meridian Holdings",
                    seats: 5,
                    plan: "Business",
                    since: "Jan 2025",
                  },
                  {
                    name: "Apex Financial",
                    seats: 15,
                    plan: "Enterprise",
                    since: "Mar 2025",
                  },
                  {
                    name: "Global Strategies Ltd",
                    seats: 8,
                    plan: "Business",
                    since: "Jun 2025",
                  },
                ].map((c) => (
                  <div
                    key={c.name}
                    className="py-4 border-b border-stone-300/30 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-heading text-sm font-bold text-ink">
                        {c.name}
                      </p>
                      <p className="meta-text">
                        {c.seats} seats · {c.plan} · Since {c.since}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "delivery" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-2">
                  Delivery Overview
                </h1>
                <p className="font-body text-sm text-redacted mb-6">
                  Next print run: July 18, 2026
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Print Copies", value: "6,842" },
                    { label: "Delivery Routes", value: "38" },
                    { label: "On-Time Rate", value: "99.2%" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="border border-stone-300/50 p-4"
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
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
