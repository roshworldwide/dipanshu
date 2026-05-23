/**
 * All editorial copy for the site. Components stay layout-only;
 * words live here so they read as one voice and edit in one place.
 */

export const nav = {
  brand: "VC",
  links: [
    { id: "hero", label: "Home", href: "#hero" },
    { id: "manifesto", label: "About", href: "#manifesto" },
    { id: "vision", label: "Vision", href: "#vision" },
    { id: "team", label: "Team", href: "#team" },
    { id: "work", label: "Work", href: "#work" },
    { id: "inquiry", label: "Inquire", href: "#inquiry" },
  ] as const,
};

export const hero = {
  lines: [
    "Vision without execution is noise.",
    "Execution without vision is labor.",
    "Great companies require both.",
  ],
  body: "A selective venture collective working across product, growth, systems, execution, and long-term strategic infrastructure.",
};

export const manifesto = {
  eyebrow: "Manifesto",
  // The <em> word is rendered as a New York serif italic accent.
  headline: { before: "Built around ", em: "systems", after: ", not noise." },
  paragraphs: [
    "We are not an agency, and we are not a fund. We are a collective of operators who have built, scaled, and repaired companies — and who choose, deliberately, to work on few things at a time.",
    "The market rewards noise. Launches, announcements, the performance of momentum. We are interested in the quieter variable underneath it: whether a company actually compounds.",
    "Compounding is structural. It comes from systems that hold under load — clear decisions, durable architecture, teams that do not need to be in the room to do the right thing.",
    "So we build those systems. Then we step back. The work should outlast our involvement, or it was not worth doing.",
  ],
};

export const visionMission = {
  eyebrow: "Vision & Mission",
  title: "Long-term thinking. Structured execution.",
  vision: {
    label: "Vision",
    body: "A generation of companies built to endure — where clarity is the default operating condition and growth is a consequence of structure, not a substitute for it.",
  },
  mission: {
    label: "Mission",
    body: "To partner with a small number of serious founders each year and install the systems, judgment, and execution infrastructure that let their ambition survive contact with scale.",
  },
};

export const philosophy = {
  eyebrow: "Philosophy",
  // `em` is the serif-italic accent word inside each principle.
  principles: [
    { before: "Clarity ", em: "compounds", after: " faster than speed." },
    { before: "Great execution is ", em: "cultural", after: "." },
    {
      before: "Sustainable systems ",
      em: "outperform",
      after: " short-term hype.",
    },
    { before: "Trust is ", em: "infrastructure", after: "." },
  ],
};

export const depth = {
  eyebrow: "Areas of Depth",
  title: "Where we go deep.",
  cards: [
    {
      id: "product-systems",
      title: "Product Systems",
      blurb:
        "The architecture beneath the roadmap — how decisions get made, shipped, and measured.",
      detail:
        "We treat product as a system of decisions, not a backlog. The goal is a team that ships the right thing without waiting for permission.",
      bullets: [
        "Decision frameworks and prioritization models",
        "Roadmap architecture and review cadence",
        "Instrumentation and outcome measurement",
      ],
    },
    {
      id: "brand-architecture",
      title: "Brand Architecture",
      blurb:
        "Narrative as a load-bearing structure — what the company means before it says anything.",
      detail:
        "Brand is the compression of strategy into something a market can hold. We build the structure, not the campaign.",
      bullets: [
        "Positioning and narrative spine",
        "Verbal and visual identity systems",
        "Message architecture across surfaces",
      ],
    },
    {
      id: "strategic-growth",
      title: "Strategic Growth",
      blurb:
        "Growth that survives the spreadsheet — durable channels over borrowed momentum.",
      detail:
        "We build growth as a portfolio of compounding channels, instrumented end to end, with no dependence on a single unstable input.",
      bullets: [
        "Channel strategy and unit economics",
        "Lifecycle and retention systems",
        "Experiment design and learning loops",
      ],
    },
    {
      id: "venture-operations",
      title: "Venture Operations",
      blurb:
        "The operating cadence of a company that does not need to be reminded to function.",
      detail:
        "Operations is the difference between a company and a group of busy people. We install the cadence, then make ourselves unnecessary.",
      bullets: [
        "Operating rhythm and planning cycles",
        "Org design and accountability mapping",
        "Internal tooling and reporting systems",
      ],
    },
    {
      id: "user-experience",
      title: "User Experience",
      blurb:
        "The felt quality of the product — where craft becomes a competitive moat.",
      detail:
        "Experience is where strategy is finally felt. We hold the line on craft because it is the part competitors cannot copy from the outside.",
      bullets: [
        "Interaction and motion systems",
        "Design quality bars and review process",
        "Accessibility and performance standards",
      ],
    },
    {
      id: "execution-infrastructure",
      title: "Execution Infrastructure",
      blurb:
        "The connective tissue — the systems that let everything above hold under load.",
      detail:
        "Execution infrastructure is the unglamorous layer that everything else stands on. When it is right, nobody notices it.",
      bullets: [
        "Workflow and process design",
        "Documentation and knowledge systems",
        "Quality gates and release discipline",
      ],
    },
  ],
};

export const team = {
  eyebrow: "Team",
  title: "A distributed network of operators and specialists.",
  members: [
    {
      id: "mercer",
      initials: "AM",
      name: "A. Mercer",
      role: "Strategic Direction",
    },
    {
      id: "okafor",
      initials: "SO",
      name: "S. Okafor",
      role: "Product & Experience",
    },
    { id: "voss", initials: "RV", name: "R. Voss", role: "Brand & Narrative" },
    {
      id: "reyes",
      initials: "DR",
      name: "D. Reyes",
      role: "Venture Operations",
    },
    {
      id: "aslam",
      initials: "NA",
      name: "N. Aslam",
      role: "Execution Systems",
    },
    {
      id: "park",
      initials: "JP",
      name: "J. Park",
      role: "Growth Infrastructure",
    },
  ],
};

export const collaborations = {
  title: "Selected collaborations.",
  cases: [
    {
      id: "meridian",
      name: "Meridian Systems",
      tags: "Product Systems · Execution Infrastructure",
      description:
        "Re-architected the product decision process for a Series B infrastructure company moving too slowly under its own weight.",
      scope: "Decision frameworks, roadmap architecture, review cadence.",
      outcome: "Cycle time from concept to ship reduced by 41%.",
      duration: "Engagement: 7 months.",
    },
    {
      id: "vantage",
      name: "Vantage Protocol",
      tags: "Brand Architecture · Strategic Growth",
      description:
        "Built the narrative spine and growth model for a protocol company that had traction but no durable story.",
      scope: "Positioning, message architecture, channel strategy.",
      outcome: "Qualified pipeline up 2.3× across two quarters.",
      duration: "Engagement: 5 months.",
    },
    {
      id: "arcline",
      name: "Arcline Health",
      tags: "Venture Operations · User Experience",
      description:
        "Installed the operating cadence and experience quality bar for a health company scaling past its founding team.",
      scope: "Operating rhythm, org design, design quality systems.",
      outcome: "Planning predictability rated 9/10 by leadership.",
      duration: "Engagement: 9 months.",
    },
  ],
};

export const closing = {
  quote:
    "Built for companies serious about execution. For founders who understand that clarity, patience, and systems thinking are not weaknesses — they are compounding advantages.",
  signature: "— The Collective",
};

export const inquiry = {
  eyebrow: "Inquiry",
  title: "Start a private conversation.",
  subhead:
    "We take on a small number of engagements each year. Tell us who you are and what you are building — if there is alignment, we will respond.",
  success: {
    title: "We've received your note.",
    subhead:
      "We respond selectively. If there is alignment, we will be in touch.",
  },
};

export const footer = {
  copyright: "© 2026 Venture Collective. All rights reserved.",
  links: ["Terms & Support", "Privacy Policy"],
};
