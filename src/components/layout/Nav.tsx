"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { nav } from "@/content/site";
import { useSceneStore } from "@/lib/store";
import { useSmoothScroll } from "./ScrollProvider";
import { Magnetic } from "@/components/ui/Magnetic";
import { Icon } from "@/components/ui/Icon";
import { EASE_EMPHASIZED, EASE_STANDARD, DUR } from "@/lib/motion";

/** The "/\" mark, drawn on with a stroke animation at mount. */
function AnimatedMark() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" aria-hidden>
      <m.path
        d="M3 20 12 4l9 16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: EASE_EMPHASIZED }}
      />
      <m.path
        d="M7.5 20 12 12l4.5 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.45}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: EASE_EMPHASIZED, delay: 0.12 }}
      />
    </svg>
  );
}

export function Nav() {
  const activeSection = useSceneStore((s) => s.activeSection);
  const { scrollTo } = useSmoothScroll();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the mobile overlay is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const go = (href: string) => {
    setOpen(false);
    scrollTo(href, { offset: -72 });
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 h-[72px] transition-colors duration-300 ease-standard"
        style={{
          backgroundColor: scrolled ? "rgba(7,7,10,0.55)" : "rgba(7,7,10,0)",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: `1px solid ${
            scrolled ? "var(--border-subtle)" : "transparent"
          }`,
        }}
      >
        <nav
          aria-label="Primary"
          className="container-x flex h-full items-center justify-between"
        >
          {/* Brand */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              go("#hero");
            }}
            className="flex items-center gap-2 text-fg-primary"
            aria-label="Venture Collective — home"
          >
            <AnimatedMark />
            <span className="font-display text-[17px] font-semibold tracking-[-0.02em]">
              {nav.brand}
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {nav.links.map((link) => {
              const isActive = activeSection === link.id;
              const isInquire = link.id === "inquiry";
              const inner = (
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(link.href);
                  }}
                  className="relative block px-3 py-2 text-[13px] uppercase tracking-[0.12em] transition-colors duration-200 ease-standard"
                  style={{
                    color: isActive
                      ? "var(--fg-primary)"
                      : "var(--fg-tertiary)",
                  }}
                  aria-current={isActive ? "true" : undefined}
                >
                  {link.label}
                  {isActive && (
                    <m.span
                      layoutId="nav-indicator"
                      className="absolute inset-x-3 -bottom-px h-px bg-fg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 30,
                      }}
                    />
                  )}
                </a>
              );
              return (
                <li key={link.id}>
                  {isInquire ? <Magnetic radius={24}>{inner}</Magnetic> : inner}
                </li>
              );
            })}
          </ul>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 p-2 text-fg-primary md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <Icon name={open ? "close" : "menu"} size={22} />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-40 flex flex-col justify-center md:hidden"
            style={{
              backgroundColor: "rgba(7,7,10,0.82)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE_STANDARD }}
          >
            <ul className="container-x flex flex-col gap-2">
              {nav.links.map((link, i) => (
                <m.li
                  key={link.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.4,
                    ease: EASE_EMPHASIZED,
                    delay: 0.04 * i,
                  }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.href);
                    }}
                    className="block py-2 font-display text-[32px] font-medium tracking-[-0.02em] text-fg-primary"
                  >
                    {link.label}
                  </a>
                </m.li>
              ))}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
