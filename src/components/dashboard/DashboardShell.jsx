import React from "react";
import {
  Bell,
  CircleHelp,
  Ellipsis,
  Home,
  LogOut,
  Search,
  X,
} from "lucide-react";
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

const getBottomNavClass = (isActive) =>
  [
    "dashboard-bottom-nav-item",
    isActive ? "dashboard-bottom-nav-item-active" : "",
  ]
    .filter(Boolean)
    .join(" ");

export default function DashboardShell({ workspaceKey, children }) {
  const workspace = dashboardWorkspaces[workspaceKey];
  const { user, logout } = useAuth();
  const [moreOpen, setMoreOpen] = React.useState(false);

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
                className="dashboard-main space-y-6 px-4 pb-24 pt-5 focus:outline-none sm:px-6 sm:py-6 md:pb-6"
              >
                {children}
              </main>
            </div>
          </div>

          <nav
            className="dashboard-bottom-nav md:hidden"
            aria-label={`${workspace.label} mobile navigation`}
          >
            <div className="grid grid-cols-5 gap-1">
              {workspace.sections.slice(0, 4).map((section) => (
                <NavLink
                  key={section.path}
                  to={section.path}
                  className={({ isActive }) => getBottomNavClass(isActive)}
                  onClick={() => setMoreOpen(false)}
                >
                  <section.icon className="h-4 w-4" />
                  <span>{section.label}</span>
                </NavLink>
              ))}
              <button
                type="button"
                className={`dashboard-bottom-nav-item ${moreOpen ? "dashboard-bottom-nav-item-active" : ""}`}
                onClick={() => setMoreOpen((open) => !open)}
                aria-expanded={moreOpen}
              >
                {moreOpen ? <X className="h-4 w-4" /> : <Ellipsis className="h-4 w-4" />}
                <span>More</span>
              </button>
            </div>
          </nav>

          {moreOpen ? (
            <div className="dashboard-more-overlay md:hidden" role="presentation" onClick={() => setMoreOpen(false)}>
              <div
                className="dashboard-more-sheet"
                role="dialog"
                aria-modal="true"
                aria-label="More workspace links"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="dashboard-page-eyebrow font-sans text-[0.65rem] font-bold uppercase tracking-[0.2em]">
                      Workspace menu
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-black text-stone-900 dark:text-stone-100">
                      More destinations
                    </h2>
                  </div>
                  <button type="button" className="dashboard-utility-button flex h-10 w-10 items-center justify-center" onClick={() => setMoreOpen(false)} aria-label="Close more menu">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {workspace.sections.slice(4).map((section) => (
                    <NavLink
                      key={section.path}
                      to={section.path}
                      className={({ isActive }) => `dashboard-more-link ${isActive ? "dashboard-more-link-active" : ""}`}
                      onClick={() => setMoreOpen(false)}
                    >
                      <section.icon className="h-4 w-4" />
                      <span>{section.label}</span>
                    </NavLink>
                  ))}
                  <NavLink to="/" className="dashboard-more-link" onClick={() => setMoreOpen(false)}>
                    <Home className="h-4 w-4" />
                    <span>Public site</span>
                  </NavLink>
                  <button type="button" className="dashboard-more-link text-rose-700" onClick={() => { setMoreOpen(false); logout(false); }}>
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
