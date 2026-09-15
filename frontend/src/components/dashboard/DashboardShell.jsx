import React from "react";
import {
  Bell,
  ChevronRight,
  CircleHelp,
  Ellipsis,
  Home,
  LogOut,
  Search,
  X,
} from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { dashboardWorkspaces } from "@/lib/dashboard-config";
import { DashboardNavBadge } from "@/components/dashboard/DashboardPrimitives";
import {
  useWorkspaceNotificationTotal,
  useWorkspaceSectionBadges,
} from "@/lib/notifications";

const getInitials = (name) =>
  (name || "Workspace")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getSidebarLinkClass = (isActive) =>
  [
    "dashboard-sidebar-link",
    "flex w-full items-center gap-3 rounded-lg px-3 py-2 font-sans text-sm",
    isActive ? "dashboard-sidebar-link-active" : "",
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
  const sectionBadges = useWorkspaceSectionBadges(workspaceKey);
  const notificationTotal = useWorkspaceNotificationTotal(workspaceKey);
  const { pathname } = useLocation();
  const activeSection =
    workspace?.sections.find(
      (section) =>
        pathname === section.path || pathname.startsWith(`${section.path}/`),
    ) || null;

  if (!workspace) {
    return null;
  }

  return (
    <div className="dashboard-workspace min-h-screen">
      <header className="dashboard-topbar sticky top-0 z-40">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-4 lg:px-6">
          <Link
            to="/"
            className="dashboard-home-mark flex h-9 w-9 shrink-0 items-center justify-center font-sans text-sm font-bold text-white"
            aria-label="Return home"
          >
            NQ
          </Link>

          <div className="hidden min-w-0 flex-col sm:flex">
            <p className="truncate font-sans text-sm font-semibold text-stone-900 dark:text-stone-100">
              {workspace.label}
            </p>
            <p className="truncate font-sans text-[0.65rem] text-stone-500 dark:text-stone-400">
              {workspace.subtitle}
            </p>
          </div>

          <p className="min-w-0 flex-1 truncate text-center font-sans text-sm font-semibold text-stone-900 dark:text-stone-100 sm:hidden">
            {activeSection ? activeSection.label : workspace.label}
          </p>

          <div className="mx-auto hidden w-full max-w-md px-2 md:block">
            <div className="dashboard-search-shell relative w-full">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400"
              />
              <div
                aria-label={`${workspace.label} search placeholder`}
                className="w-full py-2 pl-9 pr-3 font-sans text-sm text-stone-500"
              >
                {workspace.searchPlaceholder}
              </div>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="relative">
              <button
                type="button"
                className="dashboard-utility-button flex h-9 w-9 items-center justify-center"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <DashboardNavBadge
                count={notificationTotal}
                className="absolute -right-0.5 -top-0.5"
              />
            </span>
            <button
              type="button"
              className="dashboard-utility-button hidden h-9 w-9 items-center justify-center sm:flex"
              aria-label="Help"
            >
              <CircleHelp className="h-4 w-4" />
            </button>

            <div className="dashboard-profile-card flex items-center gap-2 px-2 py-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 font-sans text-xs font-bold text-white">
                {getInitials(user?.name)}
              </div>
              <div className="hidden min-w-0 lg:block">
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
      </header>

      <div className="flex">
        <aside className="dashboard-sidebar sticky top-14 hidden w-60 shrink-0 flex-col md:flex">
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label={`${workspace.label} navigation`}>
            <p className="dashboard-nav-group-label px-3 font-sans text-[0.6rem] font-bold uppercase tracking-[0.22em]">
              {workspace.label}
            </p>
            <div className="mt-2 space-y-0.5">
              {workspace.sections.map((section) => (
                <NavLink
                  key={section.path}
                  to={section.path}
                  className={({ isActive }) => getSidebarLinkClass(isActive)}
                >
                  <section.icon className="h-4 w-4 shrink-0" />
                  <span>{section.label}</span>
                  <DashboardNavBadge
                    count={sectionBadges[section.id]}
                    className="ml-auto"
                  />
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="flex flex-col gap-0.5 border-t px-3 py-3">
            <Link to="/" className={getSidebarLinkClass(false)}>
              <Home className="h-4 w-4 shrink-0" />
              <span>Public site</span>
            </Link>
            <button
              type="button"
              onClick={() => logout(false)}
              className={`${getSidebarLinkClass(false)} text-rose-700 dark:text-rose-300`}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        <main
          id="main-content"
          tabIndex={-1}
          className="dashboard-main min-h-[calc(100vh-3.5rem)] min-w-0 flex-1 px-3 pb-24 pt-5 focus:outline-none sm:px-5 sm:py-6 md:pb-8 lg:px-8"
        >
          {children}
        </main>
      </div>

      <nav
        className="dashboard-bottom-nav md:hidden"
        aria-label={`${workspace.label} mobile navigation`}
      >
        <div className="dashboard-bottom-nav-pocket">
          <div className="grid flex-1 grid-cols-5 gap-1">
            {workspace.sections.slice(0, 4).map((section) => (
              <NavLink
                key={section.path}
                to={section.path}
                className={({ isActive }) => getBottomNavClass(isActive)}
                onClick={() => setMoreOpen(false)}
              >
                <span className="relative">
                  <section.icon className="h-4 w-4" />
                  <DashboardNavBadge
                    count={sectionBadges[section.id]}
                    className="absolute -right-3 -top-1"
                  />
                </span>
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
            <div className="dashboard-more-handle" aria-hidden="true" />

            <div className="mb-3 flex items-center justify-between">
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

            <div className="dashboard-more-group">
              {workspace.sections.slice(4).map((section) => (
                <NavLink
                  key={section.path}
                  to={section.path}
                  className={({ isActive }) =>
                    `dashboard-more-group-link ${isActive ? "dashboard-more-group-link-active" : ""}`
                  }
                  onClick={() => setMoreOpen(false)}
                >
                  <span className="dashboard-more-group-link-icon">
                    <section.icon className="h-4 w-4" />
                  </span>
                  <span>{section.label}</span>
                  <DashboardNavBadge
                    count={sectionBadges[section.id]}
                    className="ml-auto"
                  />
                  <ChevronRight className="h-4 w-4" />
                </NavLink>
              ))}
            </div>

            <div className="dashboard-more-group mt-3">
              <NavLink to="/" className="dashboard-more-group-link" onClick={() => setMoreOpen(false)}>
                <span className="dashboard-more-group-link-icon">
                  <Home className="h-4 w-4" />
                </span>
                <span>Public site</span>
                <ChevronRight className="h-4 w-4" />
              </NavLink>
              <button
                type="button"
                className="dashboard-more-group-link dashboard-more-group-link-danger"
                onClick={() => {
                  setMoreOpen(false);
                  logout(false);
                }}
              >
                <span className="dashboard-more-group-link-icon">
                  <LogOut className="h-4 w-4" />
                </span>
                <span>Sign out</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}