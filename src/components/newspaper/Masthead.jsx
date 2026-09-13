import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  X,
  Globe,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Home,
  Newspaper,
  Tags,
  CreditCard,
  Ellipsis,
  TrendingUp,
  Keyboard,
  LayoutGrid,
  CornerDownLeft,
} from "lucide-react";
import { NAV_LINKS, CATEGORIES } from "@/lib/constants";
import DarkModeToggle from "@/components/DarkModeToggle";
import { useLanguage } from "@/lib/LanguageContext";
import HeritageOrnament from "@/components/newspaper/HeritageOrnament";
import { getAllArticles } from "@/lib/content-store";

const SEARCH_INDEX = getAllArticles();

const SEARCH_SUGGESTIONS = [
  "International",
  "Politics",
  "Business",
  "Technology",
  "Markets",
  "Energy",
];

const SEARCH_DESKS = [
  "News",
  "Community",
  "Business",
  "Technology",
  "Culture & Lifestyle",
  "Events",
];

const SOCIAL_LINKS = [
  { name: "Facebook", slug: "facebook", href: "https://facebook.com" },
  { name: "TikTok", slug: "tiktok", href: "https://tiktok.com" },
  { name: "Instagram", slug: "instagram", href: "https://instagram.com" },
  { name: "X", slug: "x", href: "https://x.com" },
];

const MOBILE_PRIMARY_LINKS = [
  { ...NAV_LINKS[0], icon: Home },
  { ...NAV_LINKS[1], icon: Newspaper },
  { ...NAV_LINKS[2], icon: Tags },
  { ...NAV_LINKS[3], icon: CreditCard },
];

export default function Masthead() {
  const { strings, toggleLanguage, t, formatDate } = useLanguage();
  const [compactHeader, setCompactHeader] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const lastScrollY = useRef(0);
  const scrollAnchorY = useRef(0);
  const compactHeaderRef = useRef(false);
  const animationFrameRef = useRef(0);
  const toggleLockUntilRef = useRef(0);

  useEffect(() => {
    const applyCompactHeader = (nextValue, currentScrollY) => {
      if (compactHeaderRef.current === nextValue) {
        return;
      }

      compactHeaderRef.current = nextValue;
      setCompactHeader(nextValue);
      toggleLockUntilRef.current = window.performance.now() + 260;
      scrollAnchorY.current = currentScrollY;
      lastScrollY.current = currentScrollY;
    };

    const evaluateScroll = () => {
      animationFrameRef.current = 0;
      const currentScrollY = Math.max(window.scrollY, 0);
      const delta = currentScrollY - lastScrollY.current;
      const nearTop = currentScrollY < 48;
      const restoreZone = currentScrollY < 108;
      const hasPassedHeader = currentScrollY > 172;
      const viewportBottom = currentScrollY + window.innerHeight;
      const documentBottom = document.documentElement.scrollHeight - 4;
      const atPageBottom = viewportBottom >= documentBottom;
      const now = window.performance.now();

      if (searchOpen || menuOpen || catOpen) {
        applyCompactHeader(false, currentScrollY);
        scrollAnchorY.current = currentScrollY;
        lastScrollY.current = currentScrollY;
        return;
      }

      if (nearTop) {
        applyCompactHeader(false, currentScrollY);
        scrollAnchorY.current = currentScrollY;
        lastScrollY.current = currentScrollY;
        return;
      }

      if (toggleLockUntilRef.current > now) {
        lastScrollY.current = currentScrollY;
        return;
      }

      if (atPageBottom) {
        lastScrollY.current = currentScrollY;
        return;
      }

      if (Math.abs(delta) < 12) {
        lastScrollY.current = currentScrollY;
        return;
      }

      const distanceFromAnchor = Math.abs(currentScrollY - scrollAnchorY.current);

      if (
        !compactHeaderRef.current &&
        delta > 0 &&
        hasPassedHeader &&
        distanceFromAnchor > 44
      ) {
        applyCompactHeader(true, currentScrollY);
      } else if (
        compactHeaderRef.current &&
        (restoreZone || (delta < 0 && distanceFromAnchor > 52))
      ) {
        applyCompactHeader(false, currentScrollY);
      } else if (distanceFromAnchor > 72) {
        scrollAnchorY.current = currentScrollY;
      }

      lastScrollY.current = currentScrollY;
    };

    const onScroll = () => {
      if (animationFrameRef.current) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(evaluateScroll);
    };

    evaluateScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
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

  const navigate = useNavigate();

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }
    return SEARCH_INDEX.filter((article) =>
      [
        article.headline,
        article.summary,
        article.author,
        article.category,
        article.sector,
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedQuery)),
    ).slice(0, 5);
  }, [normalizedQuery]);

  const openFirstResult = () => {
    if (searchResults.length > 0) {
      navigate(`/article/${searchResults[0].id}`);
      closeAllPanels();
    }
  };

  const highlightMatch = (text, phrase = normalizedQuery) => {
    if (!phrase || !text) {
      return text;
    }
    const index = text.toLowerCase().indexOf(phrase);
    if (index === -1) {
      return text;
    }
    return (
      <>
        {text.slice(0, index)}
        <mark className="bg-heritage/15 px-0.5 text-heritage">
          {text.slice(index, index + phrase.length)}
        </mark>
        {text.slice(index + phrase.length)}
      </>
    );
  };

  const today = formatDate(new Date(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <header
        id="masthead"
        className="sticky top-0 z-50 overflow-visible border-b border-stone-300/40 bg-paper/95 backdrop-blur-sm"
      >
      <div className="w-full overflow-visible">
        <div
          className={`overflow-hidden border-b border-stone-300/30 transition-all duration-300 ${
            compactHeader ? "max-h-0 opacity-0" : "max-h-16 opacity-100"
          }`}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-2">
            <div className="hidden items-center gap-4 md:flex">
              <span className="meta-text">{strings.today}: {today}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleLanguage}
                  className="inline-flex items-center gap-1 rounded-full border border-stone-300/60 px-3 py-1.5 font-sans text-[0.65rem] font-bold uppercase tracking-wider text-ink transition-colors hover:border-heritage hover:text-heritage"
                  aria-label={`Switch language to ${strings.switchTo}`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>{strings.switchTo}</span>
                </button>
              </div>
              <Link
                to="/subscriptions"
                className="bg-heritage px-4 py-1.5 font-sans text-xs font-semibold uppercase tracking-wider text-paper transition-colors hover:bg-ink"
              >
                {strings.subscribe}
              </Link>
            </div>
          </div>
        </div>

        <div
          className={`border-y-2 border-ink bg-paper px-4 text-ink transition-all duration-300 ${
            compactHeader ? "py-3" : "py-5"
          }`}
        >
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 md:gap-3">
            <button
              onClick={toggleSearch}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all md:h-11 md:w-11 ${
                searchOpen
                  ? "border-heritage bg-heritage text-paper"
                  : "border-stone-400 text-ink hover:border-heritage hover:text-heritage"
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

            <Link to="/" className="flex flex-col items-center justify-center text-center leading-none" onClick={closeAllPanels}>
              <h1 className="font-display text-2xl font-black tracking-tight text-ink md:text-5xl lg:text-6xl">
                ንቐደም
              </h1>
              <p className="mt-1 font-sans text-[0.5rem] uppercase tracking-[0.25em] text-redacted md:text-[0.55rem]">
                Independent Journalism Since 2024
              </p>
            </Link>

            <div className="flex items-center justify-end gap-2">
              <div className="hidden items-center gap-2 md:flex">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 w-9 items-center justify-center border border-stone-300/70 bg-vellum transition-colors hover:border-heritage hover:bg-paper"
                    aria-label={social.name}
                    title={social.name}
                  >
                    <img
                    src={`https://cdn.simpleicons.org/${social.slug}`}
                      alt=""
                      className="h-4 w-4"
                    />
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <DarkModeToggle />
                <Link
                  to="/login"
                  className="hidden font-sans text-xs font-medium uppercase tracking-wider text-redacted transition-colors hover:text-heritage md:block"
                  onClick={closeAllPanels}
                >
                  {strings.signIn}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`relative z-20 overflow-hidden transition-all duration-300 ${
            searchOpen ? "max-h-[42rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="mt-2 border-y border-stone-300/40 bg-vellum/55 px-4 pb-6 pt-5 shadow-[0_18px_30px_rgba(0,0,0,0.05)] md:mt-0 md:py-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.9fr)]">
              <div>
                <div className="flex min-h-[3.5rem] items-center gap-3 rounded-2xl border-2 border-stone-300/60 bg-paper px-4 py-1 shadow-[0_10px_30px_rgba(0,0,0,0.04)] focus-within:border-heritage/70 focus-within:shadow-[0_12px_34px_rgba(76,43,8,0.12)] transition-all">
                  <Search className="h-5 w-5 flex-shrink-0 text-heritage" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        openFirstResult();
                      }
                    }}
                    placeholder="Search articles, topics, authors..."
                    className="min-w-0 flex-1 bg-transparent py-2 font-body text-base text-ink outline-none placeholder:text-redacted/60"
                    aria-label="Search articles"
                    autoFocus
                  />
                  {searchQuery ? (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-vellum text-redacted transition-colors hover:bg-heritage hover:text-paper"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  ) : (
                    <kbd className="hidden flex-shrink-0 items-center gap-1 rounded-md border border-stone-300 bg-vellum px-2 py-1 font-sans text-[0.6rem] font-semibold uppercase tracking-wider text-redacted sm:inline-flex">
                      <CornerDownLeft className="h-3 w-3" />
                      Enter
                    </kbd>
                  )}
                </div>

                {normalizedQuery ? (
                  <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-redacted">
                        {searchResults.length > 0
                          ? `Top results · ${searchResults.length}`
                          : "No matches"}
                      </p>
                      {searchResults.length > 0 ? (
                        <span className="meta-text hidden sm:block">
                          Press Enter to open the first result
                        </span>
                      ) : null}
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="mt-3 space-y-3">
                        {searchResults.map((article) => (
                          <Link
                            key={article.id}
                            to={`/article/${article.id}`}
                            onClick={closeAllPanels}
                            className="group flex items-center gap-4 rounded-2xl border border-stone-300/50 bg-paper p-3 transition-all hover:border-heritage/50 hover:shadow-[0_12px_30px_rgba(76,43,8,0.1)]"
                          >
                            <img
                              src={article.image}
                              alt=""
                              className="h-16 w-20 flex-shrink-0 object-cover sm:h-[4.5rem] sm:w-24"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="category-label">
                                {highlightMatch(article.category)}
                              </p>
                              <h4 className="mt-1 line-clamp-2 font-heading text-sm font-bold leading-snug text-ink transition-colors group-hover:text-heritage">
                                {highlightMatch(article.headline)}
                              </h4>
                              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span className="meta-text">
                                  {highlightMatch(article.date)}
                                </span>
                                {article.author ? (
                                  <>
                                    <span className="meta-text">·</span>
                                    <span className="meta-text">
                                      {highlightMatch(article.author)}
                                    </span>
                                  </>
                                ) : null}
                              </div>
                            </div>
                            <ArrowUpRight className="h-4 w-4 flex-shrink-0 text-redacted transition-all group-hover:rotate-45 group-hover:text-heritage" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 rounded-2xl border border-dashed border-stone-300/80 bg-paper/60 px-5 py-6 text-center">
                        <p className="font-body text-sm text-redacted">
                          No stories match “{searchQuery}”.
                        </p>
                        <p className="mt-1 font-body text-xs text-redacted/80">
                          Try one of the trending topics below, or browse a desk.
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center gap-2">
                          {SEARCH_SUGGESTIONS.map((item) => (
                            <button
                              key={item}
                              onClick={() => setSearchQuery(item)}
                              className="rounded-full border border-stone-300/60 bg-paper px-3.5 py-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:border-heritage hover:text-heritage"
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="mt-5 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-heritage" />
                      <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ink">
                        Trending now
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {SEARCH_SUGGESTIONS.map((item) => (
                        <button
                          key={item}
                          onClick={() => setSearchQuery(item)}
                          className="rounded-full border border-stone-300/60 bg-paper px-3.5 py-1.5 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-ink transition-all hover:border-heritage hover:bg-heritage hover:text-paper"
                        >
                          {item}
                        </button>
                      ))}
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center gap-2">
                        <LayoutGrid className="h-4 w-4 text-heritage" />
                        <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.24em] text-ink">
                          Browse by desk
                        </p>
                      </div>
                      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {SEARCH_DESKS.map((desk) => (
                          <Link
                            key={desk}
                            to={`/categories?cat=${desk.toLowerCase()}`}
                            onClick={closeAllPanels}
                            className="group flex items-center justify-between gap-2 rounded-xl border border-stone-300/50 bg-paper px-3.5 py-2.5 font-sans text-[0.7rem] font-semibold uppercase tracking-wider text-ink transition-colors hover:border-heritage/50 hover:text-heritage"
                          >
                            {t(desk)}
                            <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-redacted transition-transform group-hover:translate-x-0.5" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-4 lg:border-l lg:border-stone-300/50 lg:pl-6">
                <div className="rounded-[1.5rem] border border-stone-300/60 bg-paper p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.28em] text-heritage">
                    Quick Access
                  </p>
                  <div className="mt-4 space-y-3">
                    {[
                      { label: "Today's Front Page", path: "/news" },
                      { label: "Reader Dashboard", path: "/dashboard" },
                      { label: "Business Workspace", path: "/business-dashboard" },
                      { label: "Admin Console", path: "/admin" },
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
                </div>

                <div className="rounded-[1.5rem] border border-stone-300/60 bg-paper p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-2 text-redacted">
                    <Keyboard className="h-4 w-4" />
                    <p className="font-sans text-[0.7rem] uppercase tracking-[0.2em]">
                      {strings.searchHint}
                    </p>
                  </div>
                  <div className="mt-4 space-y-2.5 border-t border-stone-300/40 pt-4">
                    {[
                      { keys: ["↵ Enter"], detail: "Open first result" },
                      { keys: ["Esc"], detail: "Close search" },
                    ].map((shortcut) => (
                      <div
                        key={shortcut.detail}
                        className="flex items-center justify-between gap-3"
                      >
                        <span className="font-body text-xs text-redacted">
                          {shortcut.detail}
                        </span>
                        <kbd className="rounded-md border border-stone-300 bg-vellum px-2 py-0.5 font-sans text-[0.6rem] font-semibold uppercase tracking-wider text-ink">
                          {shortcut.keys}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="newspaper-rule-thick" /> */}
        <nav className="hidden border-y border-paper/20 bg-heritage text-paper md:block">
          <div className="px-4">
            <ul className="flex items-center justify-center gap-0 divide-x divide-paper/20">
              {NAV_LINKS.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    onClick={closeAllPanels}
                    className="flex min-h-[44px] items-center px-5 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-paper transition-colors hover:bg-paper hover:text-heritage"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
              <li className="relative">
                <button
                  onClick={toggleCategories}
                    className="flex min-h-[44px] items-center gap-1 px-5 py-3 font-sans text-xs font-semibold uppercase tracking-widest text-paper transition-colors hover:bg-paper hover:text-heritage"
                >
                  {strings.categories}
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
                        {t(cat)}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </nav>
        <div className="newspaper-rule" />

      </div>

      <div className="masthead-ornament-strip" aria-hidden="true">
        <HeritageOrnament className="h-8 w-full" />
      </div>
    </header>

    <nav className="public-bottom-nav md:hidden" aria-label="Mobile site navigation">
        <div className="grid grid-cols-5 gap-1">
          {MOBILE_PRIMARY_LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `public-bottom-nav-item ${isActive ? "public-bottom-nav-item-active" : ""}`
                }
              >
                <Icon className="h-4 w-4" />
                <span>{t(link.label)}</span>
              </NavLink>
            );
          })}
          <button
            type="button"
            className={`public-bottom-nav-item ${menuOpen ? "public-bottom-nav-item-active" : ""}`}
            onClick={toggleMenu}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Ellipsis className="h-4 w-4" />}
            <span>{t("More")}</span>
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div className="public-more-overlay md:hidden" role="presentation" onClick={() => setMenuOpen(false)}>
          <div className="public-more-sheet" role="dialog" aria-modal="true" aria-label="More site links" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-sans text-[0.65rem] font-bold uppercase tracking-[0.2em] text-heritage">Explore</p>
                <h2 className="mt-1 font-display text-2xl font-black text-ink">More from ንቐደም</h2>
              </div>
              <button type="button" className="public-more-close" onClick={() => setMenuOpen(false)} aria-label="Close more menu">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {NAV_LINKS.slice(4).map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)} className="public-more-link">
                  {t(link.label)}
                </Link>
              ))}
              <Link to="/login" onClick={() => setMenuOpen(false)} className="public-more-link">
                {strings.signIn}
              </Link>
              <Link to="/delivery" onClick={() => setMenuOpen(false)} className="public-more-link">
                {t("Track Delivery")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
