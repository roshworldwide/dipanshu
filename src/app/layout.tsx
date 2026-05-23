import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { MotionProvider } from "@/components/layout/MotionProvider";
import { ScrollProvider } from "@/components/layout/ScrollProvider";
import { CustomCursor } from "@/components/layout/CustomCursor";

export const metadata: Metadata = {
  metadataBase: new URL("https://venture-collective.example"),
  title: {
    default: "Venture Collective — Vision and execution, built as one system",
    template: "%s · Venture Collective",
  },
  description:
    "A selective venture collective working across product, growth, systems, execution, and long-term strategic infrastructure.",
  openGraph: {
    title: "Venture Collective",
    description:
      "A selective venture collective. Long-term thinking, structured execution.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07070a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-text antialiased">
        {/* Skip link — first tab stop, visually hidden until focused. */}
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[100] focus:rounded-card focus:bg-fg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-bg-base"
        >
          Skip to content
        </a>
        {/* LazyMotion is loaded inside MotionProvider (client). */}
        <MotionProvider>
          <ScrollProvider>{children}</ScrollProvider>
          <CustomCursor />
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
