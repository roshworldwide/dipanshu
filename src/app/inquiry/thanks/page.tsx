import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { inquiry } from "@/content/site";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Inquiry received",
  robots: { index: false, follow: false },
};

/**
 * Standalone confirmation route. The inquiry form resolves inline on
 * the page, but this URL exists as a direct, shareable, no-JS-safe
 * landing for the post-submit state.
 */
export default function InquiryThanksPage() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-bg-base px-[var(--gutter)] text-center">
        <span className="block h-px w-20 bg-aurora-2" />
        <h1 className="mt-12 font-display text-[clamp(32px,5vw,56px)] font-medium tracking-[-0.04em] text-fg-primary">
          {inquiry.success.title}
        </h1>
        <p className="mt-6 max-w-[44ch] text-body-lg text-fg-secondary">
          {inquiry.success.subhead}
        </p>
        <Link
          href="/"
          className="mt-12 inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.16em] text-fg-tertiary transition-colors hover:text-fg-primary"
        >
          <span className="rotate-180">
            <Icon name="arrow-right" size={14} strokeWidth={1.5} />
          </span>
          Return home
        </Link>
      </main>
      <Footer />
    </>
  );
}
