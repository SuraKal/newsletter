import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Menu, X, Globe, ChevronDown } from "lucide-react";
import { NAV_LINKS, CATEGORIES } from "@/lib/constants";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function Masthead() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-50 bg-paper">
      {/* Tier 1: Utility Bar */}
      <div
        className={`transition-all duration-300 overflow-hidden ${scrolled ? "h-0 opacity-0" : "h-auto opacity-100"}`}
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="meta-text">Today: {today}</span>
            <span className="meta-text hidden sm:inline">
              Edition: International
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 meta-text hover:text-heritage transition-colors">
              <Globe className="w-3.5 h-3.5" />
              <span>EN</span>
            </button>
            <Link
              to="/subscriptions"
              className="font-sans text-xs font-semibold tracking-wider uppercase bg-heritage text-paper px-4 py-1.5 hover:bg-ink transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
        <div className="newspaper-rule max-w-7xl mx-auto" />
      </div>

      {/* Tier 2: Wordmark */}
      <div
        className={`transition-all duration-300 ${scrolled ? "py-2" : "py-5"}`}
      >
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 hover:text-heritage transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <Link to="/" className="text-center">
            <h1 className="font-display font-black tracking-tight text-ink text-3xl md:text-5xl lg:text-6xl">
              ንቐደም
            </h1>
            <p className="font-sans text-redacted tracking-widest uppercase text-[0.6rem] mt-1">
              Independent Journalism · Since 2024
            </p>
          </Link>

          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <Link
              to="/login"
              className="hidden md:block font-sans text-xs font-medium tracking-wider uppercase text-redacted hover:text-heritage transition-colors"
            >
              Sign In
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 md:hidden hover:text-heritage transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search bar */}
      {searchOpen && (
        <div className="max-w-7xl mx-auto px-4 pb-3">
          <div className="flex items-center border-b-2 border-heritage">
            <Search className="w-4 h-4 text-redacted mr-3" />
            <input
              type="text"
              placeholder="Search articles, topics, authors..."
              className="flex-1 bg-transparent font-body text-sm py-2 outline-none placeholder:text-redacted/60"
              autoFocus
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="p-1 text-redacted hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tier 3: Navigation */}
      <div className="newspaper-rule-thick max-w-7xl mx-auto" />
      <nav className="hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center justify-center gap-0 divide-x divide-stone-300/50">
            {NAV_LINKS.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="block px-5 py-3 font-sans text-xs font-semibold tracking-widest uppercase text-ink hover:text-heritage transition-colors min-h-[44px] flex items-center"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1 px-5 py-3 font-sans text-xs font-semibold tracking-widest uppercase text-ink hover:text-heritage transition-colors min-h-[44px]"
              >
                Categories{" "}
                <ChevronDown
                  className={`w-3 h-3 transition-transform ${catOpen ? "rotate-180" : ""}`}
                />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 bg-paper border border-stone-300/50 shadow-lg py-2 min-w-[180px] z-50">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      to={`/categories?cat=${cat.toLowerCase()}`}
                      onClick={() => setCatOpen(false)}
                      className="block px-5 py-2.5 font-sans text-xs font-medium tracking-wider uppercase text-ink hover:bg-vellum hover:text-heritage transition-colors min-h-[44px] flex items-center"
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
      <div className="newspaper-rule max-w-7xl mx-auto" />

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-paper border-t border-stone-300/50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="block py-3 font-sans text-sm font-semibold tracking-wider uppercase text-ink hover:text-heritage transition-colors border-b border-stone-300/30"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block py-3 font-sans text-sm font-medium tracking-wider uppercase text-redacted hover:text-heritage transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
