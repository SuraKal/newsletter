import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, User, Globe, ChevronDown, Menu, X } from "lucide-react";
import { CATEGORIES } from "@/lib/nequdem-data";

export default function Masthead() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 120);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top utility bar */}
      {!scrolled && (
        <div className="nq-parchment border-b border-rule">
          <div className="nq-container flex items-center justify-between py-2 text-xs font-sans text-muted-foreground">
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/about"
                className="hover:text-heritage transition-colors"
              >
                About
              </Link>
              <Link
                to="/business"
                className="hover:text-heritage transition-colors"
              >
                Business
              </Link>
              <Link
                to="/contact"
                className="hover:text-heritage transition-colors"
              >
                Contact
              </Link>
            </div>
            <span className="hidden md:block">{today}</span>
            <div className="flex items-center gap-4 ml-auto md:ml-0">
              <button className="flex items-center gap-1 hover:text-heritage transition-colors">
                <Globe className="w-3 h-3" />
                EN
              </button>
              <Link
                to="/login"
                className="hover:text-heritage transition-colors flex items-center gap-1"
              >
                <User className="w-3 h-3" />
                Login
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Masthead / Logo */}
      {!scrolled && (
        <div className="nq-parchment py-6 md:py-8 border-b border-rule">
          <div className="nq-container text-center">
            <Link to="/">
              <h1
                className="font-display text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-ink"
                style={{ fontStyle: "italic" }}
              >
                Nequdem
              </h1>
            </Link>
            <p className="font-sans text-xs tracking-[0.3em] uppercase text-muted-foreground mt-2">
              The World's Most Distinguished Newspaper
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav
        className={`z-50 transition-all duration-300 ${
          scrolled
            ? "fixed top-0 left-0 right-0 bg-parchment/95 backdrop-blur-sm shadow-sm border-b border-rule"
            : "nq-parchment border-b border-rule"
        }`}
      >
        <div className="nq-container flex items-center justify-between py-3">
          {scrolled && (
            <Link
              to="/"
              className="font-display text-2xl font-black text-ink italic mr-8"
            >
              Nequdem
            </Link>
          )}

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-sans">
            <Link
              to="/"
              className="text-ink hover:text-heritage transition-colors font-medium"
            >
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button className="flex items-center gap-1 text-ink hover:text-heritage transition-colors font-medium">
                Categories <ChevronDown className="w-3 h-3" />
              </button>
              {categoriesOpen && (
                <div className="absolute top-full left-0 bg-parchment border border-rule shadow-lg py-2 min-w-48 z-50">
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/categories?category=${cat.slug}`}
                      className="block px-4 py-2 text-sm hover:bg-vellum transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/news"
              className="text-ink hover:text-heritage transition-colors font-medium"
            >
              News
            </Link>
            <Link
              to="/subscriptions"
              className="text-ink hover:text-heritage transition-colors font-medium"
            >
              Subscribe
            </Link>
            <Link
              to="/business"
              className="text-ink hover:text-heritage transition-colors font-medium"
            >
              Business
            </Link>
            <Link
              to="/delivery"
              className="text-ink hover:text-heritage transition-colors font-medium"
            >
              Delivery
            </Link>
            <Link
              to="/about"
              className="text-ink hover:text-heritage transition-colors font-medium"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-ink hover:text-heritage transition-colors font-medium"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="p-2 hover:text-heritage transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <Link
              to="/subscriptions"
              className="hidden md:block nq-btn-primary text-xs py-2 px-4"
            >
              Subscribe
            </Link>
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-parchment border-t border-rule pb-4">
            <div className="nq-container flex flex-col gap-3 pt-3">
              {[
                "Home",
                "News",
                "Categories",
                "Subscribe",
                "Business",
                "Delivery",
                "About",
                "Contact",
              ].map((item) => (
                <Link
                  key={item}
                  to={
                    item === "Home"
                      ? "/"
                      : item === "Subscribe"
                        ? "/subscriptions"
                        : item === "Delivery"
                          ? "/delivery"
                          : `/${item.toLowerCase()}`
                  }
                  className="text-sm font-sans font-medium text-ink hover:text-heritage py-2 border-b border-rule/50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <Link
                to="/subscriptions"
                className="nq-btn-primary text-xs text-center mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Subscribe Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
