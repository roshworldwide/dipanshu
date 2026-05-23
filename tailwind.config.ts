import type { Config } from "tailwindcss";

/**
 * Theme extension mirrors src/styles/tokens.css.
 * Components pull from these names; the CSS variables remain the
 * single source of truth so runtime theming stays possible.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-base": "var(--bg-base)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-card": "var(--bg-card)",
        "bg-card-hover": "var(--bg-card-hover)",
        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",
        "fg-primary": "var(--fg-primary)",
        "fg-secondary": "var(--fg-secondary)",
        "fg-tertiary": "var(--fg-tertiary)",
        "fg-quaternary": "var(--fg-quaternary)",
        "aurora-1": "var(--accent-aurora-1)",
        "aurora-2": "var(--accent-aurora-2)",
        "aurora-3": "var(--accent-aurora-3)",
        "aurora-4": "var(--accent-aurora-4)",
      },
      fontFamily: {
        display: "var(--font-display)",
        text: "var(--font-text)",
        serif: "var(--font-serif)",
      },
      fontSize: {
        "display-xl": [
          "96px",
          { lineHeight: "1.02", letterSpacing: "-0.04em" },
        ],
        "display-lg": [
          "72px",
          { lineHeight: "1.02", letterSpacing: "-0.04em" },
        ],
        "display-md": [
          "56px",
          { lineHeight: "1.04", letterSpacing: "-0.04em" },
        ],
        "display-sm": [
          "44px",
          { lineHeight: "1.06", letterSpacing: "-0.035em" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "1.12", letterSpacing: "-0.02em" },
        ],
        "headline-md": [
          "24px",
          { lineHeight: "1.16", letterSpacing: "-0.02em" },
        ],
        "headline-sm": [
          "20px",
          { lineHeight: "1.2", letterSpacing: "-0.02em" },
        ],
        "body-lg": ["17px", { lineHeight: "1.55", letterSpacing: "0" }],
        "body-sm": ["15px", { lineHeight: "1.55", letterSpacing: "0" }],
        eyebrow: ["12px", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      spacing: {
        "rhythm-xl": "192px",
        "rhythm-lg": "144px",
        "rhythm-md": "96px",
        "rhythm-sm": "64px",
      },
      borderRadius: {
        card: "12px",
        "card-lg": "20px",
      },
      maxWidth: {
        container: "1280px",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.22, 1, 0.36, 1)",
        emphasized: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "scroll-shimmer": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "40%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
        "aurora-sweep": {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        "scroll-shimmer": "scroll-shimmer 2.4s var(--ease-standard) infinite",
        "aurora-sweep": "aurora-sweep 6s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
