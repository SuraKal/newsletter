import React, { useEffect, useRef, useState } from "react";

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  effect = "rise",
}) {
  const ref = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const activatedRef = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      activatedRef.current = true;
      setIsActive(true);
      return undefined;
    }

    const activateIfVisible = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
        activatedRef.current = true;
        setIsActive(true);
      }
    };

    activateIfVisible();
    if (activatedRef.current) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activatedRef.current = true;
          setIsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -2% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${isActive ? "is-active" : ""} ${className}`.trim()}
      data-effect={effect}
      style={{ "--reveal-delay": `${Math.min(delay, 180)}ms` }}
    >
      {children}
    </div>
  );
}
