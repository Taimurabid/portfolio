/**
 * A tiny 2D physics engine for "Break the site": gravity, bounces, friction,
 * box-on-box stacking and snapping back home. Pure functions over plain
 * objects, so it is unit-tested without a browser. Collision uses each card's
 * upright box; rotation is visual only, which keeps stacks stable.
 */
export type Body = {
  id: string;
  w: number;
  h: number;
  /** Where the card belongs (top-left, document coordinates). */
  homeX: number;
  homeY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Radians. */
  angle: number;
  va: number;
  held: boolean;
  placed: boolean;
};

export type Bounds = { left: number; right: number; floor: number };

export const GRAVITY = 2600; // px/s²
const MAX_DT = 1 / 30; // keep big frame gaps from tunnelling
const ITERATIONS = 4;
/** Max visual tilt. Collision boxes stay upright, so steep tilts would look like overlap. */
const MAX_TILT = 0.3; // ≈17°

export function createBody(id: string, rect: { x: number; y: number; w: number; h: number }): Body {
  return {
    id,
    w: rect.w,
    h: rect.h,
    homeX: rect.x,
    homeY: rect.y,
    x: rect.x,
    y: rect.y,
    vx: 0,
    vy: 0,
    angle: 0,
    va: 0,
    held: false,
    placed: false,
  };
}

/** Pops every body upward and sideways. `random` is injectable for tests. */
export function explode(bodies: Body[], random: () => number = Math.random): void {
  for (const b of bodies) {
    b.placed = false;
    b.vx = (random() * 2 - 1) * 700;
    b.vy = -(400 + random() * 600);
    b.va = (random() * 2 - 1) * 2.5;
  }
}

const free = (b: Body) => !b.held && !b.placed;

function constrain(b: Body, bounds: Bounds): void {
  if (b.y + b.h > bounds.floor) {
    b.y = bounds.floor - b.h;
    if (b.vy > 0) b.vy = Math.abs(b.vy) < 120 ? 0 : -b.vy * 0.2;
    b.vx *= 0.85;
    b.va = b.va * 0.5 - b.angle * 0.4; // settle towards lying flat
  }
  if (b.x < bounds.left) {
    b.x = bounds.left;
    b.vx = Math.abs(b.vx) * 0.4;
  } else if (b.x + b.w > bounds.right) {
    b.x = bounds.right - b.w;
    b.vx = -Math.abs(b.vx) * 0.4;
  }
}

/** Pushes two overlapping boxes apart along the shallower axis. Held bodies don't move. */
export function separate(a: Body, b: Body): void {
  const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
  const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
  if (ox <= 0 || oy <= 0) return;
  const wa = a.held ? 0 : 1;
  const wb = b.held ? 0 : 1;
  if (wa + wb === 0) return;
  const share = (w: number) => w / (wa + wb);

  if (ox < oy) {
    const dir = a.x < b.x ? -1 : 1;
    a.x += dir * ox * share(wa);
    b.x -= dir * ox * share(wb);
    const vx = (a.vx + b.vx) / 2;
    a.vx = b.vx = vx * 0.6;
  } else {
    const dir = a.y < b.y ? -1 : 1;
    a.y += dir * oy * share(wa);
    b.y -= dir * oy * share(wb);
    const [top, bottom] = a.y < b.y ? [a, b] : [b, a];
    if (top.vy > bottom.vy) top.vy = bottom.vy; // land on it, don't sink in
    top.vx *= 0.9;
    top.va = top.va * 0.5 - top.angle * 0.4;
  }
}

/** Advances the world by `dt` seconds. */
export function step(bodies: Body[], bounds: Bounds, dt: number): void {
  const t = Math.min(Math.max(dt, 0), MAX_DT);
  for (const b of bodies) {
    if (b.held) {
      b.angle *= 0.8; // straighten up while dragged
      continue;
    }
    if (b.placed) continue;
    b.vy += GRAVITY * t;
    b.x += b.vx * t;
    b.y += b.vy * t;
    b.angle = Math.max(-MAX_TILT, Math.min(MAX_TILT, b.angle + b.va * t));
    b.va *= 0.98;
  }
  const active = bodies.filter((b) => !b.placed);
  for (let i = 0; i < ITERATIONS; i++) {
    for (let j = 0; j < active.length; j++) {
      for (let k = j + 1; k < active.length; k++) separate(active[j]!, active[k]!);
    }
    for (const b of active) if (free(b)) constrain(b, bounds);
  }
}

export function distanceFromHome(b: Body): number {
  return Math.hypot(b.x - b.homeX, b.y - b.homeY);
}

/**
 * Drops a released card into place if it's close enough and upright.
 * Returns how many px off it was when it snapped, or null if it didn't.
 */
export function trySnap(b: Body, threshold = 32): number | null {
  const off = distanceFromHome(b);
  if (off > threshold || Math.abs(b.angle) > 0.3) return null;
  Object.assign(b, {
    x: b.homeX,
    y: b.homeY,
    vx: 0,
    vy: 0,
    angle: 0,
    va: 0,
    held: false,
    placed: true,
  });
  return off;
}

/** Throw velocity from recent pointer samples (px, ms), clamped to stay sane. */
export function throwVelocity(samples: { x: number; y: number; t: number }[]): {
  vx: number;
  vy: number;
} {
  const first = samples[0];
  const last = samples[samples.length - 1];
  if (!first || !last || last.t - first.t < 1) return { vx: 0, vy: 0 };
  const seconds = (last.t - first.t) / 1000;
  const clamp = (v: number) => Math.max(-2500, Math.min(2500, v));
  return { vx: clamp((last.x - first.x) / seconds), vy: clamp((last.y - first.y) / seconds) };
}
