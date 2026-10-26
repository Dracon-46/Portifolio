/**
 * Target shapes for the particle field. Every formation has the same particle
 * count, so the vertex shader can morph particle i of one shape into particle
 * i of the next. Units: the camera sees roughly 6.3 units of height at z = 0.
 */

export const FORMATION_COUNT = 6;

/** Deterministic PRNG (mulberry32): the same field on every load. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Writer = (i: number, x: number, y: number, z: number) => void;

function writer(out: Float32Array): Writer {
  return (i, x, y, z) => {
    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  };
}

/** Uniform direction on the unit sphere. */
function onSphere(r: () => number): [number, number, number] {
  const u = r() * 2 - 1;
  const t = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(t), u, s * Math.sin(t)];
}

/** 0 — the core: a dense shell with a halo of dust. */
function core(n: number, r: () => number, set: Writer) {
  for (let i = 0; i < n; i++) {
    const [x, y, z] = onSphere(r);
    const halo = r() < 0.16;
    const rad = halo ? 2.1 + Math.pow(r(), 0.7) * 2.4 : 1.55 * (0.82 + 0.18 * Math.sqrt(r()));
    set(i, x * rad, y * rad, z * rad);
  }
}

/** 1 — Nicx: a slime with a squashed base, two bright eyes and a puddle. */
function slime(n: number, r: () => number, set: Writer) {
  for (let i = 0; i < n; i++) {
    const k = r();
    if (k < 0.07) {
      // Eyes: two small disks on the front of the body.
      const side = k < 0.035 ? -1 : 1;
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * 0.13;
      set(i, side * 0.5 + Math.cos(a) * d * 0.8, 0.2 + Math.sin(a) * d, 1.45);
    } else if (k < 0.18) {
      // Puddle ring on the floor.
      const a = r() * Math.PI * 2;
      const d = 1.55 + r() * 0.75;
      set(i, Math.cos(a) * d, -0.88 + (r() - 0.5) * 0.04, Math.sin(a) * d * 0.55);
    } else {
      const [x, y, z] = onSphere(r);
      const rad = 1.5 * (0.9 + 0.1 * Math.sqrt(r()));
      const yy = y < 0 ? y * 0.45 : y * 0.92;
      set(i, x * rad * 1.12, yy * rad - 0.2, z * rad * 1.0);
    }
  }
}

/** 2 — Ascend: a tapering spiral staircase rising to a star. */
function stairs(n: number, r: () => number, set: Writer) {
  const steps = 30;
  for (let i = 0; i < n; i++) {
    const k = r();
    if (k < 0.06) {
      const [x, y, z] = onSphere(r);
      const d = 0.16 * Math.sqrt(r());
      set(i, x * d, 2.35 + y * d, z * d);
    } else if (k < 0.16) {
      // Sparks drifting up through the middle of the tower.
      set(i, (r() - 0.5) * 0.5, -2.2 + r() * 4.4, (r() - 0.5) * 0.5);
    } else {
      const step = Math.floor(r() * steps);
      const t = (step + r() * 0.85) / steps;
      const angle = t * Math.PI * 5;
      const radius = 1.55 - t * 0.85;
      const width = 0.18 + (1 - t) * 0.22;
      const rr = radius + (r() - 0.5) * width * 2;
      const y = -2.2 + (step / steps) * 4.3 + r() * 0.03;
      set(i, Math.cos(angle) * rr, y, Math.sin(angle) * rr);
    }
  }
}

/** 3 — AetherTable: five cards fanned out like a hand. */
function cards(n: number, r: () => number, set: Writer) {
  const w = 1.05;
  const h = 1.5;
  const pivotY = -2.6;
  for (let i = 0; i < n; i++) {
    const card = Math.floor(r() * 5);
    const angle = (card - 2) * 0.24;
    let x: number;
    let y: number;
    if (r() < 0.62) {
      // Card border.
      const p = r() * 2 * (w + h);
      if (p < w) [x, y] = [p - w / 2, -h / 2];
      else if (p < w + h) [x, y] = [w / 2, p - w - h / 2];
      else if (p < 2 * w + h) [x, y] = [p - w - h - w / 2, h / 2];
      else [x, y] = [-w / 2, p - 2 * w - h - h / 2];
      x += (r() - 0.5) * 0.02;
      y += (r() - 0.5) * 0.02;
    } else if (r() < 0.5) {
      // A glyph: a ring in the art box.
      const a = r() * Math.PI * 2;
      const d = 0.24 + (r() - 0.5) * 0.03;
      [x, y] = [Math.cos(a) * d, 0.22 + Math.sin(a) * d];
    } else {
      [x, y] = [(r() - 0.5) * w * 0.9, (r() - 0.5) * h * 0.9];
    }
    // Rotate around a pivot below the hand.
    const cy = y + 0.6 - pivotY;
    const rx = x * Math.cos(angle) - cy * Math.sin(angle);
    const ry = x * Math.sin(angle) + cy * Math.cos(angle) + pivotY;
    set(i, rx, ry, card * 0.06 - 0.12 + (r() - 0.5) * 0.02);
  }
}

/** 4 — Lumen: a field of data columns, like a city of bars seen from above. */
function columns(n: number, r: () => number, set: Writer) {
  const grid = 18;
  const spacing = 0.19;
  const tilt = 0.5;
  const ct = Math.cos(tilt);
  const stt = Math.sin(tilt);
  for (let i = 0; i < n; i++) {
    const gx = Math.floor(r() * grid);
    const gz = Math.floor(r() * grid);
    const u = gx / (grid - 1) - 0.5;
    const v = gz / (grid - 1) - 0.5;
    const height =
      0.15 + 1.5 * Math.max(0, 0.55 + 0.45 * Math.sin(u * 7.1 + 1.3) * Math.cos(v * 5.3 - 0.4) - Math.hypot(u, v) * 0.6);
    const x = (gx - (grid - 1) / 2) * spacing + (r() - 0.5) * 0.06;
    const z = (gz - (grid - 1) / 2) * spacing + (r() - 0.5) * 0.06;
    // Most particles on the cap so the tops read as a surface.
    const y = -1.1 + (r() < 0.45 ? height : r() * height);
    // Tilt the whole field toward the camera.
    set(i, x, y * ct - z * stt, y * stt + z * ct);
  }
}

/** 5 — Cosmos: a wide, shallow starfield behind the rest of the page. */
function cosmos(n: number, r: () => number, set: Writer) {
  for (let i = 0; i < n; i++) {
    set(i, (r() - 0.5) * 20, (r() - 0.5) * 11, -7 + r() * 9);
  }
}

export function buildFormations(count: number): Float32Array[] {
  const builders = [core, slime, stairs, cards, columns, cosmos];
  return builders.map((build, index) => {
    const out = new Float32Array(count * 3);
    build(count, rng(1337 + index * 101), writer(out));
    return out;
  });
}

/** Per-particle random in [0, 1) and size multiplier. */
export function buildAttributes(count: number): { random: Float32Array; size: Float32Array } {
  const r = rng(7);
  const random = new Float32Array(count);
  const size = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    random[i] = r();
    // Mostly fine dust, a few larger motes.
    size[i] = r() < 0.04 ? 2.2 + r() * 1.4 : 0.6 + r() * 0.8;
  }
  return { random, size };
}
