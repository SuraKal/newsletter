import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  Globe,
  ChevronDown,
  ArrowRight,
  Clock3,
} from "lucide-react";
import { NAV_LINKS, CATEGORIES } from "@/lib/constants";
import DarkModeToggle from "@/components/DarkModeToggle";

const SEARCH_SUGGESTIONS = ["Politics", "Business", "Technology", "Markets"];

export default function Masthead() {
  const [compactHeader, setCompactHeader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const lastScrollY = useRef(0);
  const scrollAnchorY = useRef(0);
  const compactHeaderRef = useRef(false);

  useEffect(() => {
    const applyCompactHeader = (nextValue) => {
      compactHeaderRef.current = nextValue;
      setCompactHeader(nextValue);
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;
      const nearTop = currentScrollY < 24;
      const hasPassedHeader = currentScrollY > 140;
      const viewportBottom = currentScrollY + window.innerHeight;
      const documentBottom = document.documentElement.scrollHeight - 4;
      const atPageBottom = viewportBottom >= documentBottom;

      if (searchOpen || menuOpen || catOpen) {
        applyCompactHeader(false);
        scrollAnchorY.current = currentScrollY;
        lastScrollY.current = currentScrollY;
        return;
      }

      if (nearTop) {
        applyCompactHeader(false);
        scrollAnchorY.current = currentScrollY;
        lastScrollY.current = currentScrollY;
        return;
      }

      if (atPageBottom) {
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(delta) < 8) {
        lastScrollY.current = currentScrollY;
        return;
      }

      const distanceFromAnchor = Math.abs(currentScrollY - scrollAnchorY.current);

      if (
        !compactHeaderRef.current &&
        delta > 0 &&
        hasPassedHeader &&
        distanceFromAnchor > 20
      ) {
        applyCompactHeader(true);
        scrollAnchorY.current = currentScrollY;
      } else if (
        compactHeaderRef.current &&
        delta < 0 &&
        distanceFromAnchor > 28
      ) {
        applyCompactHeader(false);
        scrollAnchorY.current = currentScrollY;
      }

      lastScrollY.current = currentScrollY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [catOpen, menuOpen, searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  const toggleSearch = () => {
    compactHeaderRef.current = false;
    setCompactHeader(false);
    setSearchOpen((prev) => !prev);
    setMenuOpen(false);
    setCatOpen(false);
  };

  const toggleMenu = () => {
    compactHeaderRef.current = false;
    setCompactHeader(false);
    setMenuOpen((prev) => !prev);
    setSearchOpen(false);
    setCatOpen(false);
  };

  const toggleCategories = () => {
    compactHeaderRef.current = false;
    setCompactHeader(false);
    setCatOpen((prev) => !prev);
    setSearchOpen(false);
  };

  const closeAllPanels = () => {
    compactHeaderRef.current = false;
    setCompactHeader(false);
    setSearchOpen(false);
    setMenuOpen(false);
    setCatOpen(false);
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 overflow-visible border-b border-stone-300/40 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl overflow-visible">
        <div
          className={`overflow-hidden border-b border-stone-300/30 transition-all duration-300 ${
            compactHeader ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-4">
              <span className="meta-text">Today: {today}</span>
              <span className="meta-text hidden sm:inline">
                Edition: International
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="meta-text flex items-center gap-1 transition-colors hover:text-heritage">
                <Globe className="h-3.5 w-3.5" />
                <span>EN</span>
              </button>
              <Link
                to="/subscriptions"
                className="bg-heritage px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`bg-heritage px-4 text-cream transition-all duration-300 rounded-2xl ${
            compactHeader ? "py-3" : "py-5"
          }`}
        >
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <button
              onClick={toggleSearch}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all ${
                searchOpen
                  ? "border-cream bg-cream text-heritage"
                  : "border-cream/25 text-cream hover:border-cream hover:text-white"
              }`}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              {searchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            <Link to="/" className="text-center" onClick={closeAllPanels}>
              <h1 className="font-display text-3xl font-black tracking-tight text-cream md:text-5xl lg:text-6xl">
                ንቐደም
              </h1>
              <p className="mt-1 font-sans text-[0.6rem] uppercase tracking-[0.35em] text-cream/60">
                Independent Journalism Since 2024
              </p>
            </Link>

            <div className="flex items-center justify-end gap-3">
              <DarkModeToggle />
              <Link
                to="/login"
                className="hidden font-sans text-xs font-medium uppercase tracking-wider text-cream/70 transition-colors hover:text-cream md:block"
                onClick={closeAllPanels}
              >
                Sign In
              </Link>
              <button
                onClick={toggleMenu}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cream/25 text-cream transition-colors hover:border-cream hover:text-white md:hidden"
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                {menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`relative z-20 overflow-hidden transition-all duration-300 ${
            searchOpen ? "max-h-[34rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 border-y border-stone-300/40 bg-vellum/55 px-4 pb-5 pt-5 shadow-[0_18px_30px_rgba(0,0,0,0.05)] md:mt-0 md:py-5">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(280px,0.9fr)]">
              <div>
                <div className="min-h-[3.5rem] rounded-2xl border border-stone-300/60 bg-paper px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.04)] md:min-h-0">
                  <div className="flex items-center gap-3">
                    <Search className="h-4 w-4 text-redacted" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search articles, topics, authors..."
                      className="flex-1 bg-transparent font-body text-sm text-ink outline-none placeholder:text-redacted/60"
                      autoFocus
                    />
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="rounded-full p-1 text-redacted transition-colors hover:text-ink"
                        aria-label="Clear search"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SEARCH_SUGGESTIONS.map((item) => (
                    <button
                      key={item}
                      onClick={() => setSearchQuery(item)}
                      className="rounded-full border border-stone-300/60 bg-paper px-3 py-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:border-heritage hover:text-heritage"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-stone-300/60 bg-paper p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-heritage">
                  Quick Access
                </p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Today's Front Page", path: "/news" },
                    { label: "Reader Dashboard", path: "/dashboard" },
                    { label: "Business Coverage", path: "/business" },
                  ].map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeAllPanels}
                      className="flex items-center justify-between border-b border-stone-300/40 pb-3 font-body text-sm text-ink transition-colors last:border-b-0 last:pb-0 hover:text-heritage"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-2 text-redacted">
                  <Clock3 className="h-4 w-4" />
                  <p className="font-sans text-[0.7rem] uppercase tracking-[0.2em]">
                    Search opens as a quick browse panel
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="newspaper-rule-thick" /> */}
        <nav className="hidden md:block">
          <div className="px-4">
            <ul className="flex items-center justify-center gap-0 divide-x divide-stone-300/50">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={closeAllPanels}
                    className="flex min-h-[44px] items-center px-5 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:text-heritage"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="relative">
                <button
                  onClick={toggleCategories}
                  className="flex min-h-[44px] items-center gap-1 px-5 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-ink transition-colors hover:text-heritage"
                >
                  Categories
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${
                      catOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {catOpen && (
                  <div className="absolute left-0 top-full z-50 min-w-[200px] border border-stone-300/50 bg-paper py-2 shadow-lg">
                    {CATEGORIES.map((cat) => (
                      <Link
                        key={cat}
                        to={`/categories?cat=${cat.toLowerCase()}`}
                        onClick={() => setCatOpen(false)}
                        className="flex min-h-[44px] items-center px-5 py-2.5 font-sans text-xs font-medium uppercase tracking-wider text-ink transition-colors hover:bg-vellum hover:text-heritage"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </nav>
        <div className="newspaper-rule" />

        {menuOpen && (
          <div className="border-t border-stone-300/50 bg-paper md:hidden">
            <div className="px-4 py-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className="block border-b border-stone-300/30 py-3 font-sans text-sm font-semibold uppercase tracking-wider text-ink transition-colors hover:text-heritage"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block py-3 font-sans text-sm font-medium uppercase tracking-wider text-redacted transition-colors hover:text-heritage"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
