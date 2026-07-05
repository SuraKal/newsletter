import React, { useState } from "react";
import PageWrapper from "@/components/nequdem/PageWrapper";
import { ARTICLES, IMAGES } from "@/lib/nequdem-data";
import {
  FileText,
  Users,
  Truck,
  BarChart3,
  PenTool,
  Calendar,
  Eye,
  TrendingUp,
  Newspaper,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const tabs = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "articles", label: "Articles", icon: FileText },
  { id: "subscribers", label: "Subscribers", icon: Users },
  { id: "business", label: "Business Clients", icon: Newspaper },
  { id: "deliveries", label: "Deliveries", icon: Truck },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <PageWrapper>
      <div className="nq-container py-10">
        <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground mb-8">
          <Link to="/" className="hover:text-heritage transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-heritage">Admin Dashboard</span>
        </div>

        <h1 className="nq-headline text-2xl md:text-4xl">Admin Dashboard</h1>
        <p className="nq-deck mt-1">
          Manage content, subscribers, and delivery operations.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
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

          <div className="lg:col-span-4">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Total Subscribers",
                      value: "2,431,876",
                      icon: Users,
                      change: "+1,245 today",
                    },
                    {
                      label: "Articles Published",
                      value: "12,847",
                      icon: FileText,
                      change: "+8 today",
                    },
                    {
                      label: "Active Deliveries",
                      value: "147,320",
                      icon: Truck,
                      change: "In progress",
                    },
                    {
                      label: "Page Views (Today)",
                      value: "3.2M",
                      icon: Eye,
                      change: "+12% vs avg",
                    },
                  ].map(({ label, value, icon: Icon, change }) => (
                    <div
                      key={label}
                      className="p-5 border border-rule nq-parchment"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground">
                          {label}
                        </span>
                        <Icon className="w-4 h-4 text-heritage" />
                      </div>
                      <div className="font-display text-2xl font-bold text-ink mt-2">
                        {value}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-heritage" />
                        <span className="font-sans text-[11px] text-heritage">
                          {change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 border border-rule nq-parchment">
                    <div className="flex items-center gap-3 mb-4">
                      <PenTool className="w-5 h-5 text-heritage" />
                      <h3 className="font-sans text-sm font-bold text-ink">
                        Publish Article
                      </h3>
                    </div>
                    <p className="font-sans text-xs text-muted-foreground mb-4">
                      Create and publish a new article to the platform.
                    </p>
                    <button className="nq-btn-primary text-xs py-2 px-4">
                      New Article
                    </button>
                  </div>
                  <div className="p-6 border border-rule nq-parchment">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar className="w-5 h-5 text-heritage" />
                      <h3 className="font-sans text-sm font-bold text-ink">
                        Schedule Article
                      </h3>
                    </div>
                    <p className="font-sans text-xs text-muted-foreground mb-4">
                      Schedule articles for future publication dates.
                    </p>
                    <button className="nq-btn-outline text-xs py-2 px-4">
                      Schedule
                    </button>
                  </div>
                </div>

                {/* Recent articles */}
                <div className="border border-rule p-6 nq-parchment">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                    Recently Published
                  </h3>
                  {ARTICLES.slice(0, 4).map((article) => (
                    <div
                      key={article.id}
                      className="flex items-center justify-between py-3 border-b border-rule/50 last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={IMAGES[article.image]}
                          alt=""
                          className="w-12 h-12 object-cover"
                        />
                        <div>
                          <p className="font-sans text-sm text-ink font-medium line-clamp-1">
                            {article.title}
                          </p>
                          <p className="font-sans text-xs text-muted-foreground">
                            {article.author} · {article.date}
                          </p>
                        </div>
                      </div>
                      <span className="nq-category-label text-[10px]">
                        {article.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "articles" && (
              <div className="border border-rule p-6 nq-parchment">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage">
                    All Articles
                  </h3>
                  <button className="nq-btn-primary text-xs py-2 px-4">
                    New Article
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-4 pb-3 border-b border-rule font-sans text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                  <span className="col-span-2">Title</span>
                  <span>Category</span>
                  <span>Author</span>
                  <span>Date</span>
                  <span>Status</span>
                </div>
                {ARTICLES.map((article) => (
                  <div
                    key={article.id}
                    className="grid grid-cols-6 gap-4 py-3 border-b border-rule/50 last:border-0 items-center"
                  >
                    <span className="font-sans text-sm text-ink col-span-2 line-clamp-1">
                      {article.title}
                    </span>
                    <span className="nq-category-label text-[10px]">
                      {article.category}
                    </span>
                    <span className="font-sans text-xs text-muted-foreground">
                      {article.author}
                    </span>
                    <span className="font-sans text-xs text-muted-foreground">
                      {article.date}
                    </span>
                    <span className="font-sans text-xs text-heritage font-semibold">
                      Published
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "subscribers" && (
              <div className="border border-rule p-6 nq-parchment">
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                  Subscriber Overview
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: "Digital Only", value: "1,847,234" },
                    { label: "Print + Digital", value: "412,892" },
                    { label: "Business", value: "171,750" },
                  ].map(({ label, value }) => (
                    <div key={label} className="p-4 nq-vellum text-center">
                      <div className="font-display text-xl font-bold text-ink">
                        {value}
                      </div>
                      <div className="font-sans text-xs text-muted-foreground mt-1">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[
                    {
                      name: "James Richardson",
                      plan: "Print + Digital",
                      since: "Mar 2024",
                    },
                    {
                      name: "Acme Corporation",
                      plan: "Business Ledger",
                      since: "Jan 2025",
                    },
                    {
                      name: "Dr. Helena Vasquez",
                      plan: "Digital Standard",
                      since: "Sep 2023",
                    },
                    {
                      name: "Nordic Ventures AB",
                      plan: "Business Ledger",
                      since: "Feb 2024",
                    },
                    {
                      name: "Thomas Eriksen",
                      plan: "Print + Digital",
                      since: "Jun 2025",
                    },
                  ].map((sub) => (
                    <div
                      key={sub.name}
                      className="flex items-center justify-between py-3 border-b border-rule/50 last:border-0"
                    >
                      <div>
                        <p className="font-sans text-sm font-medium text-ink">
                          {sub.name}
                        </p>
                        <p className="font-sans text-xs text-muted-foreground">
                          Since {sub.since}
                        </p>
                      </div>
                      <span className="font-sans text-xs text-heritage font-semibold">
                        {sub.plan}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "business" && (
              <div className="border border-rule p-6 nq-parchment">
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                  Business Clients
                </h3>
                {[
                  {
                    name: "Acme Corporation",
                    seats: 18,
                    plan: "25 seats",
                    mrr: "$1,242",
                  },
                  {
                    name: "Nordic Ventures AB",
                    seats: 45,
                    plan: "100 seats",
                    mrr: "$2,430",
                  },
                  {
                    name: "Sterling & Partners",
                    seats: 8,
                    plan: "10 seats",
                    mrr: "$552",
                  },
                  {
                    name: "Global Finance Group",
                    seats: 120,
                    plan: "Custom",
                    mrr: "$5,400",
                  },
                ].map((client) => (
                  <div
                    key={client.name}
                    className="flex items-center justify-between py-4 border-b border-rule/50 last:border-0"
                  >
                    <div>
                      <p className="font-sans text-sm font-semibold text-ink">
                        {client.name}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground">
                        {client.seats} active seats · {client.plan} plan
                      </p>
                    </div>
                    <span className="font-sans text-sm font-semibold text-ink">
                      {client.mrr}/mo
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "deliveries" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "In Transit", value: "47,320", icon: Truck },
                    { label: "Delivered Today", value: "89,412", icon: Clock },
                    {
                      label: "Delivery Rate",
                      value: "98.7%",
                      icon: TrendingUp,
                    },
                  ].map(({ label, value, icon: Icon }) => (
                    <div
                      key={label}
                      className="p-5 border border-rule nq-parchment"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-heritage" />
                        <span className="font-sans text-[11px] uppercase tracking-wider text-muted-foreground">
                          {label}
                        </span>
                      </div>
                      <div className="font-display text-2xl font-bold text-ink mt-2">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border border-rule p-6 nq-parchment">
                  <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-heritage mb-4">
                    Regional Overview
                  </h3>
                  {[
                    {
                      region: "United Kingdom",
                      total: "45,230",
                      delivered: "42,100",
                      rate: "93.1%",
                    },
                    {
                      region: "North America",
                      total: "38,750",
                      delivered: "36,920",
                      rate: "95.3%",
                    },
                    {
                      region: "Europe",
                      total: "28,340",
                      delivered: "27,800",
                      rate: "98.1%",
                    },
                    {
                      region: "Asia Pacific",
                      total: "18,500",
                      delivered: "18,320",
                      rate: "99.0%",
                    },
                    {
                      region: "Middle East & Africa",
                      total: "16,500",
                      delivered: "15,272",
                      rate: "92.6%",
                    },
                  ].map((r) => (
                    <div
                      key={r.region}
                      className="flex items-center justify-between py-3 border-b border-rule/50 last:border-0"
                    >
                      <span className="font-sans text-sm text-ink font-medium">
                        {r.region}
                      </span>
                      <div className="flex items-center gap-6 font-sans text-xs">
                        <span className="text-muted-foreground">
                          {r.total} total
                        </span>
                        <span className="text-heritage font-semibold">
                          {r.delivered} delivered
                        </span>
                        <span className="text-ink font-bold">{r.rate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
