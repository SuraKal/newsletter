import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const getHashId = (hash) => {
  const rawId = hash.slice(1);

  try {
    return decodeURIComponent(rawId);
  } catch {
    return rawId;
  }
};

const ensureMainTarget = () => {
  const main =
    document.querySelector("main") || document.querySelector("[role='main']");

  if (!(main instanceof HTMLElement)) {
    return null;
  }

  if (!main.id) {
    main.id = "main-content";
  }

  if (!main.hasAttribute("tabindex")) {
    main.setAttribute("tabindex", "-1");
  }

  return main;
};

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    const main = ensureMainTarget();

    if (navigationType === "POP") return;

    if (hash) {
      const id = getHashId(hash);
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return () => window.clearTimeout(timer);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.requestAnimationFrame(() => {
      main?.focus({ preventScroll: true });
    });
  }, [pathname, hash, navigationType]);

  return null;
}
