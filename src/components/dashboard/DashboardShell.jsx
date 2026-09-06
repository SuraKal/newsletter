import React from "react";
import { Bell, CircleHelp, Home, LogOut, Search } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { dashboardWorkspaces } from "@/lib/dashboard-config";

const getInitials = (name) =>
  (name || "Workspace")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getRailLinkClass = (isActive) =>
  [
    "dashboard-rail-button",
    "flex h-11 w-11 items-center justify-center border",
    isActive ? "dashboard-rail-button-active" : "border-transparent",
  ]
    .filter(Boolean)
    .join(" ");

const getSectionPillClass = (isActive) =>
  [
    "dashboard-section-pill",
    "inline-flex items-center px-4 py-2 font-sans text-xs font-medium",
    isActive ? "dashboard-section-pill-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

const getMobileRailClass = (isActive) =>
  [
    "dashboard-mobile-rail-button",
    "inline-flex min-w-[88px] items-center gap-2 px-3 py-2 font-sans text-xs font-medium",
    isActive ? "dashboard-mobile-rail-button-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

export default function DashboardShell({ workspaceKey, children }) {
  const workspace = dashboardWorkspaces[workspaceKey];
  const { user, logout } = useAuth();

  if (!workspace) {
    return null;
  }

  return (
    <div className="dashboard-workspace min-h-screen px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="mx-auto max-w-[1440px]">
        <div className="dashboard-frame overflow-hidden">
          <div className="grid min-h-[calc(100vh-2rem)] grid-cols-1 md:grid-cols-[88px_minmax(0,1fr)]">
            <aside className="dashboard-rail hidden md:flex md:flex-col md:items-center md:justify-between md:px-4 md:py-6">
              <div className="flex flex-col items-center gap-4">
                <Link
                  to="/"
                  className="dashboard-home-mark flex h-12 w-12 items-center justify-center font-sans text-base font-bold text-white"
                  aria-label="Return home"
                >
                  NQ
                </Link>
                <div className="flex flex-col items-center gap-2">
                  {workspace.sections.map((section) => (
                    <NavLink
                      key={section.path}
                      to={section.path}
                      className={({ isActive }) => getRailLinkClass(isActive)}
                      title={section.label}
                      aria-label={section.label}
                    >
                      <section.icon className="h-4 w-4" />
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Link
                  to="/"
                  className={getRailLinkClass(false)}
                  title="Public site"
                  aria-label="Public site"
                >
                  <Home className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => logout(false)}
                  className={getRailLinkClass(false)}
                  title="Sign out"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </aside>

            <div className="min-w-0">
              <header className="dashboard-topbar px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="dashboard-search-shell relative w-full max-w-xl">
                    <Search
                      aria-hidden="true"
                      className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
                    />
                    <div
                      aria-label={`${workspace.label} search placeholder`}
                      className="w-full py-3 pl-11 pr-4 font-sans text-sm text-stone-500"
                    >
                      {workspace.searchPlaceholder}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="dashboard-utility-button flex h-11 w-11 items-center justify-center"
                        aria-label="Notifications"
                      >
                        <Bell className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="dashboard-utility-button flex h-11 w-11 items-center justify-center"
                        aria-label="Help"
                      >
                        <CircleHelp className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="dashboard-profile-card flex items-center gap-3 px-3 py-2">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 font-sans text-xs font-bold text-white">
                        {getInitials(user?.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
                          {user?.name || workspace.label}
                        </p>
                        <p className="truncate font-sans text-xs text-stone-500 dark:text-stone-400">
                          {user?.email || workspace.subtitle}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <nav
                  className="dashboard-mobile-rail mt-4 overflow-x-auto md:hidden"
                  aria-label={`${workspace.label} sections`}
                >
                  <ul className="flex min-w-max gap-2 pb-1">
                    {workspace.sections.map((section) => (
                      <li key={section.path}>
                        <NavLink
                          to={section.path}
                          className={({ isActive }) => getMobileRailClass(isActive)}
                        >
                          <section.icon className="h-3.5 w-3.5" />
                          <span>{section.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>

                <nav
                  className="mt-5 hidden overflow-x-auto md:block"
                  aria-label={`${workspace.label} sections`}
                >
                  <ul className="flex min-w-max gap-2">
                    {workspace.sections.map((section) => (
                      <li key={section.path}>
                        <NavLink
                          to={section.path}
                          className={({ isActive }) => getSectionPillClass(isActive)}
                        >
                          {section.label}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </nav>
              </header>

              <main
                id="main-content"
                tabIndex={-1}
                className="dashboard-main space-y-6 px-4 py-5 focus:outline-none sm:px-6 sm:py-6"
              >
                {children}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
