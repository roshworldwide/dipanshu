"use client";

import { Section } from "@/components/layout/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/layout/Reveal";
import { team } from "@/content/site";

/**
 * Deterministic studio-portrait placeholder. A dark monochrome
 * silhouette — proportions seeded from the member id so each reads
 * distinct. Drop real photos into /public/team and swap to next/image.
 */
function Portrait({ seed }: { seed: string }) {
  const n = seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const headW = 88 + (n % 14); // shoulder + head proportion variation
  const headY = 150 + (n % 18);
  const shoulderW = 230 + (n % 40);

  return (
    <svg
      viewBox="0 0 400 520"
      className="h-full w-full"
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`bg-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#101016" />
          <stop offset="100%" stopColor="#08080b" />
        </linearGradient>
        <radialGradient id={`rim-${seed}`} cx="0.5" cy="0.34" r="0.6">
          <stop offset="0%" stopColor="#2a2c38" />
          <stop offset="100%" stopColor="#0c0c11" />
        </radialGradient>
      </defs>
      <rect width="400" height="520" fill={`url(#bg-${seed})`} />
      {/* Shoulders */}
      <ellipse
        cx="200"
        cy="540"
        rx={shoulderW}
        ry="190"
        fill={`url(#rim-${seed})`}
      />
      {/* Head */}
      <ellipse
        cx="200"
        cy={headY}
        rx={headW}
        ry={headW * 1.18}
        fill="#1c1d28"
      />
      {/* Soft key light */}
      <ellipse
        cx={172}
        cy={headY - 18}
        rx={headW * 0.5}
        ry={headW * 0.7}
        fill="#262838"
        opacity="0.8"
      />
    </svg>
  );
}

export function Team() {
  return (
    <Section id="team" track="team" scene rhythm="lg">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{team.eyebrow}</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-6 max-w-[20ch] font-display text-[clamp(28px,4vw,44px)] font-medium leading-[1.08] tracking-[-0.035em] text-fg-primary">
            {team.title}
          </h2>
        </Reveal>

        <Stagger
          gap={0.07}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {team.members.map((member) => (
            <StaggerItem key={member.id}>
              <figure
                data-cursor-hover
                className="group cursor-pointer"
                tabIndex={0}
                aria-label={`${member.name}, ${member.role}`}
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-card border border-border-subtle">
                  {/* Portrait — desaturated at rest, full + lifted on hover. */}
                  <div className="h-full w-full brightness-[0.82] grayscale transition-[filter,transform] duration-[600ms] ease-standard group-focus-within:scale-[1.04] group-focus-within:grayscale-0 group-hover:scale-[1.04] group-hover:brightness-100 group-hover:grayscale-0">
                    <Portrait seed={member.id} />
                  </div>
                  {/* Aurora wash returns with colour on hover. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[600ms] ease-standard group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(160deg, rgba(110,123,255,0.10), transparent 55%)",
                    }}
                  />
                </div>
                <figcaption className="mt-4">
                  <p className="font-display text-headline-sm font-medium tracking-[-0.02em] text-fg-secondary transition-colors duration-[600ms] ease-standard group-focus-within:text-fg-primary group-hover:text-fg-primary">
                    {member.name}
                  </p>
                  <p className="eyebrow mt-2">{member.role}</p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
