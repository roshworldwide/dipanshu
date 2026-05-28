"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { brand, nav } from "@/content/site";
import { useSmoothScroll } from "./ScrollProvider";
import { Magnetic } from "@/components/ui/Magnetic";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "@/components/ui/Logo";
import { EASE_EMPHASIZED, EASE_STANDARD, DUR } from "@/lib/motion";

export function Nav() {
  const { scrollTo } = useSmoothScroll();
  const [open, setOpen] = useState(false);

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
    // Non-sticky nav: no offset needed; the target lands flush with viewport top.
    scrollTo(href);
  };

  return (
    <>
      <header className="hairline-b">
        <nav
          aria-label="Primary"
          className="container-x flex h-20 items-center justify-between"
        >
          {/* Brand */}
          <m.a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              go("#hero");
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_EMPHASIZED }}
            className="inline-flex items-center text-fg-primary"
            aria-label={`${brand.name} — home`}
          >
            <Logo size={28} />
          </m.a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 md:flex">
            {nav.links.map((link) => {
              if (link.id === "contact") {
                return (
                  <li key={link.id} className="ml-3">
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
              if (link.id === "hero") return null;
              return (
                <li key={link.id}>
                  <a
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      go(link.href);
                    }}
                    className="block px-3.5 py-2 text-[11px] uppercase tracking-[0.14em] text-fg-tertiary transition-colors duration-200 ease-standard hover:text-fg-primary"
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile trigger */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-fg-primary transition-colors hover:bg-white/[0.06] md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <Icon name={open ? "close" : "menu"} size={20} />
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-40 flex flex-col justify-center md:hidden"
            style={{
              backgroundColor: "rgba(7,7,10,0.86)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DUR.fast, ease: EASE_STANDARD }}
          >
            {/* Close button — needed since the nav itself is no longer
                fixed and can be off-screen when the overlay opens. */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-[var(--gutter)] top-7 flex h-10 w-10 items-center justify-center rounded-full text-fg-primary"
            >
              <Icon name="close" size={20} />
            </button>
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
