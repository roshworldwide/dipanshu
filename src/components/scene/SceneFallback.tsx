import { buildField } from "./field-data";

/**
 * Reduced-motion fallback — a static, baked rendering of the same
 * lattice the WebGL scene draws. No canvas, no animation; identical
 * node graph projected once through a fixed perspective camera.
 */
const VB = 1000;
const CAM_Z = 11;
const FOCAL = 620;

function project(x: number, y: number, z: number) {
  const s = FOCAL / (CAM_Z - z);
  return { sx: VB / 2 + x * s, sy: VB / 2 - y * s, depth: s };
}

export function SceneFallback({ className }: { className?: string }) {
  const field = buildField();
  const pts = Array.from({ length: field.count }, (_, i) =>
    project(field.nodes[i * 3], field.nodes[i * 3 + 1], field.nodes[i * 3 + 2]),
  );

  return (
    <div className={className} aria-hidden>
      <div className="absolute inset-0 bg-bg-base" />
      {/* Aurora bloom wash behind the lattice. */}
      <div
        className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.22] blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, #6e7bff 0%, #9ae6ff 45%, transparent 70%)",
        }}
      />
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="#9ae6ff" strokeWidth={0.6} opacity={0.16}>
          {field.edges.map(([a, b], i) => (
            <line
              key={i}
              x1={pts[a].sx}
              y1={pts[a].sy}
              x2={pts[b].sx}
              y2={pts[b].sy}
            />
          ))}
        </g>
        <g fill="#cdd3ff">
          {pts.map((p, i) => (
            <circle
              key={i}
              cx={p.sx}
              cy={p.sy}
              r={Math.max(1.2, p.depth * 0.05)}
              opacity={0.55}
            />
          ))}
        </g>
      </svg>
      {/* Vignette to match the WebGL post-process. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 45%, rgba(7,7,10,0.85) 100%)",
        }}
      />
    </div>
  );
}
