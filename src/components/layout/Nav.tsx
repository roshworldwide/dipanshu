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
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden>
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
    // Capsule floats 16px from the viewport top + 48px tall: reserve ~80px.
    scrollTo(href, { offset: -80 });
  };

  return (
    <>
      {/* Outer header is a pointer-events-none ribbon — only the pill
          itself accepts pointer events, so the hairline space around
          the capsule never blocks clicks on hero content. */}
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-5">
        <m.nav
          aria-label="Primary"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_EMPHASIZED, delay: 0.1 }}
          className="pointer-events-auto flex h-12 max-w-[calc(100vw-2rem)] items-center gap-1 rounded-full border border-border-subtle pl-4 pr-1.5 transition-colors duration-300 ease-standard"
          style={{
            backgroundColor: scrolled
              ? "rgba(7,7,10,0.72)"
              : "rgba(7,7,10,0.45)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          {/* Brand */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              go("#hero");
            }}
            className="flex items-center gap-2 pr-1 text-fg-primary"
            aria-label="Venture Collective — home"
          >
            <AnimatedMark />
            <span className="font-display text-[14px] font-semibold tracking-[-0.01em]">
              {nav.brand}
            </span>
          </a>

          {/* Hairline divider only when desktop links are shown. */}
          <span
            aria-hidden
            className="mx-2 hidden h-4 w-px bg-border-subtle md:inline-block"
          />

          {/* Desktop links */}
          <ul className="hidden items-center md:flex">
            {nav.links.map((link) => {
              const isActive = activeSection === link.id;
              const isInquire = link.id === "inquiry";

              if (isInquire) {
                return (
                  <li key={link.id} className="ml-1">
                    <Magnetic radius={28}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          go(link.href);
                        }}
                        className="flex h-9 items-center rounded-full bg-fg-primary px-4 text-[11px] uppercase tracking-[0.14em] text-bg-base transition-opacity duration-200 ease-standard hover:opacity-90"
                      >
                        {link.label}
                      </a>
                    </Magnetic>
                  </li>
                );
              }

              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.href);
                    }}
                    className="relative block px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] transition-colors duration-200 ease-standard"
                    style={{
                      color: isActive
                        ? "var(--fg-primary)"
                        : "var(--fg-tertiary)",
                    }}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {/* The indicator is a small rounded pill behind the
                        active link, sliding via shared layoutId. */}
                    {isActive && (
                      <m.span
                        layoutId="nav-indicator"
                        className="absolute inset-0 -z-[1] rounded-full border border-border-subtle bg-white/[0.06]"
                        transition={{
                          type: "spring",
                          stiffness: 360,
                          damping: 32,
                        }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-full text-fg-primary transition-colors hover:bg-white/[0.06] md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
        </m.nav>
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
