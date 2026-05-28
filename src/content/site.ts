/**
 * All editorial copy for the site. Components stay layout-only;
 * words live here so they read as one voice and edit in one place.
 *
 * Source: One Collective landing-page copy (2026).
 */

export const brand = {
  name: "One Collective",
  /** Path to the brand mark in /public. */
  logoSrc: "/logo.svg",
};

export const nav = {
  links: [
    { id: "hero", label: "Home", href: "#hero" },
    { id: "work", label: "Work", href: "#work" },
    { id: "approach", label: "Approach", href: "#approach" },
    { id: "collective", label: "The Collective", href: "#collective" },
    { id: "contact", label: "Contact", href: "#contact" },
  ] as const,
};

export const hero = {
  /** "Depth" renders as a serif italic accent inside an <em>. */
  headline: { before: "Steadiness. ", em: "Depth.", after: " Character." },
  body: "One Collective is a curated network of independent specialists brought together through shared standards, long-term thinking, and dependable execution.",
};

export const work = {
  eyebrow: "Work",
  title: "The work takes different forms.",
  items: [
    {
      id: "strategy",
      title: "Strategy",
      description:
        "Brand positioning, direction, systems thinking, and long-term decision making.",
    },
    {
      id: "technology",
      title: "Technology",
      description:
        "Web development, digital infrastructure, implementation, and technical support.",
    },
    {
      id: "design",
      title: "Design",
      description:
        "Brand identity, visual systems, digital experiences, and communication design.",
    },
    {
      id: "execution",
      title: "All-Round Execution",
      description:
        "Cross-functional execution shaped around the evolving needs of the work.",
    },
  ],
};

export const approach = {
  eyebrow: "Approach",
  /** "aligned" renders as a serif italic accent. */
  headline: {
    before: "You can feel the difference when people are ",
    em: "aligned",
    after: ".",
  },
  intro:
    "Conversations become clearer. Decisions carry more weight. Things move more steadily with greater intent. One Collective brings together people who value working this way.",
  subTitle: "The way people work together matters.",
  paragraphs: [
    "We work in small, carefully assembled teams shaped around the needs of each project.",
    "The focus is not volume or speed for its own sake, but clarity, ownership, and people who communicate well and carry strong judgment into the work they do.",
    "The result is a steadier, more thoughtful way of building together.",
  ],
};

export const collective = {
  eyebrow: "The Collective",
  title: "The collective.",
  // Placeholder entries — the PDF brief lists Name / Role / LinkedIn
  // four times. Real members can be dropped in via this array.
  members: [
    { id: "m1", name: "Name", role: "Role / Area of Work", linkedin: "#" },
    { id: "m2", name: "Name", role: "Role / Area of Work", linkedin: "#" },
    { id: "m3", name: "Name", role: "Role / Area of Work", linkedin: "#" },
    { id: "m4", name: "Name", role: "Role / Area of Work", linkedin: "#" },
  ],
};

export const contact = {
  eyebrow: "Contact",
  title: "Some conversations deserve intention.",
  subhead:
    "Conversations can become work. Or become perspective, direction, or future alignment.",
  cta: "Begin a conversation",
  success: {
    title: "We've received your note.",
    subhead:
      "Some conversations take time. If there is alignment, we will be in touch.",
  },
};

export const footer = {
  copyright: "© 2026 One Collective. All rights reserved.",
  links: ["Terms & Support", "Privacy Policy"],
};
