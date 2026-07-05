import React, { useState } from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import { ARTICLES, IMAGES } from "@/lib/nequdem-data";
import {
  User,
  CreditCard,
  Truck,
  BookOpen,
  Bookmark,
  Settings,
  CheckCircle,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";

const tabs = [
  { id: "overview", label: "Overview", icon: User },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "deliveries", label: "Deliveries", icon: Truck },
  { id: "reading", label: "Reading History", icon: BookOpen },
  { id: "saved", label: "Saved Articles", icon: Bookmark },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function ReaderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageWrapper>
      <div className="nq-container py-10">
        <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground mb-8">
          <Link to="/" className="hover:text-heritage transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-heritage">Reader Dashboard</span>
        </div>

        <h1 className="nq-headline text-2xl md:text-4xl">
          Welcome Back, Reader
        </h1>
        <p className="nq-deck mt-2">
          Manage your subscription, track deliveries, and access your reading
          history.
        </p>

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
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Plan",
                      value: "Print + Digital",
                      icon: CreditCard,
                    },
                    {
                      label: "Next Delivery",
                      value: "July 12, 2026",
                      icon: Truck,
                    },
                    { label: "Articles Read", value: "147", icon: BookOpen },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="p-6 border border-rule nq-parchment"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-heritage" />
                        <span className="font-sans text-xs uppercase tracking-wider text-muted-foreground">
                          {label}
                        </span>
                      </div>
                      <div className="font-display text-xl font-bold text-ink mt-2">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Recent activity */}
                <div className="border border-rule p-6 nq-parchment">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        action: "Read article",
                        detail: ARTICLES[0].title,
                        time: "2 hours ago",
                        icon: BookOpen,
                      },
                      {
                        action: "Delivery completed",
                        detail: "Edition July 1, 2026 — London",
                        time: "4 days ago",
                        icon: CheckCircle,
                      },
                      {
                        action: "Payment processed",
                        detail: "Monthly subscription — $39.99",
                        time: "5 days ago",
                        icon: CreditCard,
                      },
                    ].map(({ action, detail, time, icon: Icon }) => (
                      <div
                        key={action + detail}
                        className="flex items-start gap-3"
                      >
                        <Icon className="w-4 h-4 text-heritage mt-0.5" />
                        <div>
                          <p className="font-sans text-sm text-ink">{action}</p>
                          <p className="font-sans text-xs text-muted-foreground">
                            {detail}
                          </p>
                          <p className="font-sans text-[11px] text-rule mt-0.5">
                            {time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "subscription" && (
              <div className="space-y-6">
                <div className="p-8 nq-vellum border border-heritage">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-xl font-bold text-ink">
                        Print + Digital
                      </h3>
                      <p className="font-sans text-sm text-muted-foreground mt-1">
                        Active since March 14, 2024
                      </p>
                    </div>
                    <span className="bg-heritage text-parchment text-[10px] font-sans font-bold uppercase tracking-widest px-3 py-1">
                      Active
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Monthly Cost", value: "$39.99" },
                      { label: "Next Billing", value: "Aug 1, 2026" },
                      { label: "Payment Method", value: "•••• 4242" },
                      { label: "Auto-Renew", value: "Enabled" },
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
                {/* Payment history */}
                <div className="border border-rule p-6 nq-parchment">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                    Payment History
                  </h3>
                  <div className="space-y-3">
                    {[
                      "July 1, 2026",
                      "June 1, 2026",
                      "May 1, 2026",
                      "April 1, 2026",
                    ].map((date) => (
                      <div
                        key={date}
                        className="flex items-center justify-between py-2 border-b border-rule/50 last:border-0"
                      >
                        <div>
                          <p className="font-sans text-sm text-ink">{date}</p>
                          <p className="font-sans text-xs text-muted-foreground">
                            Print + Digital — Monthly
                          </p>
                        </div>
                        <span className="font-sans text-sm font-semibold text-ink">
                          $39.99
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "deliveries" && (
              <div className="space-y-6">
                <div className="p-6 nq-vellum border border-rule">
                  <div className="flex items-center gap-3 mb-4">
                    <Package className="w-5 h-5 text-heritage" />
                    <h3 className="font-sans text-sm font-bold text-ink">
                      Next Delivery
                    </h3>
                    <span className="text-[10px] font-sans bg-heritage/10 text-heritage px-2 py-0.5 font-bold uppercase tracking-wider">
                      In Transit
                    </span>
                  </div>
                  <p className="font-sans text-sm text-ink">
                    Edition: July 12, 2026
                  </p>
                  <p className="font-sans text-xs text-muted-foreground">
                    Estimated arrival: July 12, 2026 by 12:00 PM
                  </p>
                  <Link
                    to="/delivery"
                    className="nq-btn-outline text-xs mt-4 inline-block"
                  >
                    Track This Delivery
                  </Link>
                </div>
                {/* Past deliveries */}
                <div className="border border-rule p-6 nq-parchment">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                    Past Deliveries
                  </h3>
                  {[
                    "June 28, 2026",
                    "June 14, 2026",
                    "May 31, 2026",
                    "May 17, 2026",
                  ].map((date) => (
                    <div
                      key={date}
                      className="flex items-center justify-between py-3 border-b border-rule/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-heritage" />
                        <div>
                          <p className="font-sans text-sm text-ink">
                            Edition: {date}
                          </p>
                          <p className="font-sans text-xs text-muted-foreground">
                            Delivered successfully
                          </p>
                        </div>
                      </div>
                      <span className="font-sans text-xs text-heritage font-semibold">
                        Delivered
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reading" && (
              <div className="space-y-4">
                {ARTICLES.slice(0, 5).map((article) => (
                  <Link
                    to={`/article/${article.id}`}
                    key={article.id}
                    className="flex gap-4 items-start p-4 border border-rule hover:bg-vellum transition-colors group"
                  >
                    <img
                      src={IMAGES[article.image]}
                      alt={article.title}
                      className="w-20 h-20 object-cover flex-shrink-0"
                    />
                    <div>
                      <span className="nq-category-label text-[10px]">
                        {article.category}
                      </span>
                      <h4 className="nq-headline text-sm mt-1 group-hover:text-heritage transition-colors">
                        {article.title}
                      </h4>
                      <p className="font-sans text-xs text-muted-foreground mt-1">
                        Read on {article.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="space-y-4">
                {ARTICLES.slice(3, 7).map((article) => (
                  <Link
                    to={`/article/${article.id}`}
                    key={article.id}
                    className="flex gap-4 items-start p-4 border border-rule hover:bg-vellum transition-colors group"
                  >
                    <img
                      src={IMAGES[article.image]}
                      alt={article.title}
                      className="w-20 h-20 object-cover flex-shrink-0"
                    />
                    <div>
                      <span className="nq-category-label text-[10px]">
                        {article.category}
                      </span>
                      <h4 className="nq-headline text-sm mt-1 group-hover:text-heritage transition-colors">
                        {article.title}
                      </h4>
                      <p className="font-sans text-xs text-muted-foreground mt-1">
                        Saved on {article.date}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="p-6 border border-rule nq-parchment">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                    Profile
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-sans text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                        Full Name
                      </label>
                      <input
                        defaultValue="James Richardson"
                        className="w-full px-4 py-3 border border-rule bg-parchment font-sans text-sm"
                      />
                    </div>
                    <div>
                      <label className="font-sans text-xs text-muted-foreground uppercase tracking-wider block mb-1">
                        Email
                      </label>
                      <input
                        defaultValue="james.richardson@email.com"
                        className="w-full px-4 py-3 border border-rule bg-parchment font-sans text-sm"
                      />
                    </div>
                  </div>
                  <button className="nq-btn-primary text-xs mt-6">
                    Update Profile
                  </button>
                </div>
                <div className="p-6 border border-rule nq-parchment">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Breaking news alerts",
                      "Delivery updates",
                      "Weekly digest",
                      "Subscription reminders",
                    ].map((pref) => (
                      <label
                        key={pref}
                        className="flex items-center gap-3 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-4 h-4 accent-heritage"
                        />
                        <span className="font-sans text-sm text-ink">
                          {pref}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
