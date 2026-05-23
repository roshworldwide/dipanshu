/**
 * Deterministic geometry for "The Collective Field".
 *
 * The same seed drives both the live WebGL lattice and the baked SVG
 * fallback, so the reduced-motion image matches the real scene exactly.
 */

/** mulberry32 — tiny deterministic PRNG. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface FieldData {
  count: number;
  /** Flat node positions, length = count * 3. */
  nodes: Float32Array;
  /** Edge index pairs into `nodes`. */
  edges: [number, number][];
}

export const FIELD_SEED = 0x5e1ec7;
export const NODE_COUNT = 64;

/** Build the node cloud + nearest-neighbour edge graph. */
export function buildField(count = NODE_COUNT, seed = FIELD_SEED): FieldData {
  const rand = mulberry32(seed);
  const nodes = new Float32Array(count * 3);

  // Distribute nodes in a gently flattened ellipsoid shell + core.
  for (let i = 0; i < count; i++) {
    const u = rand();
    const v = rand();
    const theta = u * Math.PI * 2;
    const phi = Math.acos(2 * v - 1);
    // radius biased outward so the field reads as a volume, not a ball.
    const r = 3.4 + Math.pow(rand(), 0.6) * 4.2;
    nodes[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.15;
    nodes[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.82;
    nodes[i * 3 + 2] = r * Math.cos(phi) * 0.95;
  }

  // Connect each node to its 3 nearest neighbours (deduped).
  const edges: [number, number][] = [];
  const seen = new Set<string>();
  for (let i = 0; i < count; i++) {
    const dists: { j: number; d: number }[] = [];
    for (let j = 0; j < count; j++) {
      if (i === j) continue;
      const dx = nodes[i * 3] - nodes[j * 3];
      const dy = nodes[i * 3 + 1] - nodes[j * 3 + 1];
      const dz = nodes[i * 3 + 2] - nodes[j * 3 + 2];
      dists.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    dists.sort((a, b) => a.d - b.d);
    for (let k = 0; k < 3; k++) {
      const j = dists[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  }

  return { count, nodes, edges };
}
