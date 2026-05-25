/**
 * AmbientBackdrop — the calm, static aurora wash that sits behind the
 * upper editorial sections. No animation, no canvas, no JS cost: three
 * heavily-blurred radial blooms layered over the base, finished with a
 * subtle vignette so focus collapses toward content.
 *
 * Replaces the WebGL "Collective Field" on the landing page. The
 * lattice scene still lives under /dev/scene if it's ever wanted back.
 */
export function AmbientBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Solid base so the page never shows through. */}
      <div className="absolute inset-0 bg-bg-base" />

      {/* Upper-left bloom — primary indigo. */}
      <div
        className="absolute -left-[18%] -top-[22%] h-[80vh] w-[80vh] rounded-full opacity-[0.18] blur-[140px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--accent-aurora-1) 0%, transparent 70%)",
        }}
      />

      {/* Lower-right bloom — secondary cyan. */}
      <div
        className="absolute -bottom-[18%] -right-[14%] h-[72vh] w-[72vh] rounded-full opacity-[0.14] blur-[160px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--accent-aurora-2) 0%, transparent 70%)",
        }}
      />

      {/* Quiet warm accent — keeps the centre from reading as a void. */}
      <div
        className="absolute left-1/2 top-[38%] h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.08] blur-[180px]"
        style={{
          background:
            "radial-gradient(closest-side, var(--accent-aurora-3) 0%, transparent 70%)",
        }}
      />

      {/* Vignette — matches the post-process language of the prior scene. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(7,7,10,0.7) 100%)",
        }}
      />
    </div>
  );
}
