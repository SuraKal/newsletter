import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Newspaper,
  Truck,
  CreditCard,
  BookOpen,
  Bookmark,
  User,
  LogOut,
} from "lucide-react";
import Masthead from "@/components/newspaper/Masthead";
import Footer from "@/components/newspaper/Footer";

const tabs = [
  { id: "overview", label: "Overview", icon: Newspaper },
  { id: "deliveries", label: "Deliveries", icon: Truck },
  { id: "history", label: "Reading History", icon: BookOpen },
  { id: "saved", label: "Saved Articles", icon: Bookmark },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "profile", label: "Profile", icon: User },
];

const savedArticles = [
  {
    id: "sa-1",
    headline: "Global Leaders Convene for Historic Climate Accord",
    category: "World",
    date: "July 4, 2026",
  },
  {
    id: "sa-2",
    headline: "Quantum Computing Breakthrough in Drug Discovery",
    category: "Technology",
    date: "July 2, 2026",
  },
  {
    id: "sa-3",
    headline: "The Vanishing Art of the Morning Paper",
    category: "Feature",
    date: "July 4, 2026",
  },
];

const readingHistory = [
  {
    headline: "Senate Approves Sweeping Infrastructure Bill",
    date: "July 4, 2026",
    readTime: "6 min",
  },
  {
    headline: "Major Tech Firms Report Record Quarterly Earnings",
    date: "July 3, 2026",
    readTime: "4 min",
  },
  {
    headline: "Electoral Reform Commission Publishes Recommendations",
    date: "July 3, 2026",
    readTime: "8 min",
  },
  {
    headline: "Olympic Committee Unveils Host City Selection",
    date: "July 2, 2026",
    readTime: "5 min",
  },
];

const payments = [
  {
    date: "July 1, 2026",
    amount: "$24.99",
    plan: "Print + Digital",
    status: "Paid",
  },
  {
    date: "June 1, 2026",
    amount: "$24.99",
    plan: "Print + Digital",
    status: "Paid",
  },
  {
    date: "May 1, 2026",
    amount: "$24.99",
    plan: "Print + Digital",
    status: "Paid",
  },
];

export default function ReaderDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-paper">
      <Masthead />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="mb-6">
              <div className="w-16 h-16 rounded-full bg-warmbeige flex items-center justify-center mb-3">
                <span className="font-display text-xl font-bold text-heritage">
                  JD
                </span>
              </div>
              <h2 className="font-heading text-lg font-bold text-ink">
                Jane Doe
              </h2>
              <p className="meta-text">Print + Digital Subscriber</p>
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
                  Welcome back, Jane
                </h1>
                <p className="font-body text-sm text-redacted mt-1">
                  Here's your reading summary
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                  <div className="border border-stone-300/50 p-5">
                    <p className="font-sans text-xs font-bold tracking-widest uppercase text-redacted">
                      Subscription
                    </p>
                    <p className="font-display text-xl font-bold text-ink mt-1">
                      Print + Digital
                    </p>
                    <p className="meta-text mt-1">Renews August 1, 2026</p>
                  </div>
                  <div className="border border-stone-300/50 p-5">
                    <p className="font-sans text-xs font-bold tracking-widest uppercase text-redacted">
                      Next Delivery
                    </p>
                    <p className="font-display text-xl font-bold text-ink mt-1">
                      July 18
                    </p>
                    <p className="meta-text mt-1">Estimated 8:00 AM</p>
                  </div>
                  <div className="border border-stone-300/50 p-5">
                    <p className="font-sans text-xs font-bold tracking-widest uppercase text-redacted">
                      Articles Read
                    </p>
                    <p className="font-display text-xl font-bold text-ink mt-1">
                      47
                    </p>
                    <p className="meta-text mt-1">This month</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-sans text-xs font-bold tracking-widest uppercase text-ink mb-4">
                    Recent Reading
                  </h3>
                  {readingHistory.slice(0, 3).map((item) => (
                    <div
                      key={item.headline}
                      className="py-3 border-b border-stone-300/30 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-heading text-sm font-bold text-ink">
                          {item.headline}
                        </p>
                        <p className="meta-text mt-0.5">
                          {item.date} · {item.readTime}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "deliveries" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink">
                  Delivery Tracking
                </h1>
                <p className="font-body text-sm text-redacted mt-1 mb-6">
                  Track your newspaper deliveries
                </p>
                <Link
                  to="/delivery"
                  className="font-sans text-xs font-bold tracking-wider uppercase text-heritage hover:text-ink transition-colors"
                >
                  Open Full Tracking →
                </Link>
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-6">
                  Reading History
                </h1>
                {readingHistory.map((item) => (
                  <div
                    key={item.headline}
                    className="py-3 border-b border-stone-300/30 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-heading text-sm font-bold text-ink">
                        {item.headline}
                      </p>
                      <p className="meta-text mt-0.5">
                        {item.date} · {item.readTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "saved" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-6">
                  Saved Articles
                </h1>
                {savedArticles.map((a) => (
                  <Link
                    key={a.id}
                    to={`/article/${a.id}`}
                    className="block py-3 border-b border-stone-300/30 hover:bg-vellum/30 transition-colors"
                  >
                    <span className="category-label">{a.category}</span>
                    <p className="font-heading text-sm font-bold text-ink mt-1">
                      {a.headline}
                    </p>
                    <p className="meta-text mt-0.5">{a.date}</p>
                  </Link>
                ))}
              </div>
            )}

            {activeTab === "billing" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-6">
                  Payment History
                </h1>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-ink">
                        <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                          Date
                        </th>
                        <th className="text-left font-sans text-xs font-bold tracking-widest uppercase text-ink py-3">
                          Plan
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
                      {payments.map((p) => (
                        <tr
                          key={p.date}
                          className="border-b border-stone-300/30"
                        >
                          <td className="py-3 meta-text">{p.date}</td>
                          <td className="py-3 font-body text-sm text-ink">
                            {p.plan}
                          </td>
                          <td className="py-3 font-body text-sm font-semibold text-ink">
                            {p.amount}
                          </td>
                          <td className="py-3">
                            <span className="font-sans text-xs font-bold tracking-wider uppercase text-green-700">
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h1 className="font-display text-2xl font-black text-ink mb-6">
                  Profile Settings
                </h1>
                <div className="space-y-5 max-w-lg">
                  <div>
                    <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Jane Doe"
                      className="w-full bg-transparent border-b-2 border-stone-300 py-2 font-body text-sm text-ink focus:border-heritage outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="jane.doe@email.com"
                      className="w-full bg-transparent border-b-2 border-stone-300 py-2 font-body text-sm text-ink focus:border-heritage outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs font-bold tracking-wider uppercase text-ink block mb-2">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      defaultValue="12 Westminster Lane, London, SW1A 1AA"
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
