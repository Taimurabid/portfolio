import { describe, expect, it } from "vitest";
import {
  createBody,
  distanceFromHome,
  explode,
  separate,
  step,
  throwVelocity,
  trySnap,
  type Body,
  type Bounds,
} from "./physics";

const bounds: Bounds = { left: 0, right: 1000, floor: 800 };
const box = (id: string, x: number, y: number, w = 100, h = 100) => createBody(id, { x, y, w, h });

function run(bodies: Body[], seconds: number) {
  for (let t = 0; t < seconds; t += 1 / 60) step(bodies, bounds, 1 / 60);
}

const overlaps = (a: Body, b: Body) =>
  Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) > 1 &&
  Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) > 1;

describe("step", () => {
  it("drops a body onto the floor and lets it rest there", () => {
    const b = box("a", 100, 0);
    run([b], 3);
    expect(b.y + b.h).toBeCloseTo(bounds.floor, 0);
    expect(Math.abs(b.vy)).toBeLessThan(1);
  });

  it("keeps bodies inside the walls", () => {
    const b = box("a", 500, 0);
    b.vx = 5000;
    run([b], 2);
    expect(b.x + b.w).toBeLessThanOrEqual(bounds.right + 0.001);
  });

  it("stacks bodies instead of letting them pass through each other", () => {
    const bottom = box("a", 100, 600);
    const top = box("b", 120, 300);
    run([bottom, top], 3);
    expect(overlaps(bottom, top)).toBe(false);
    expect(top.y + top.h).toBeLessThanOrEqual(bottom.y + 1);
  });

  it("ignores huge frame gaps (no tunnelling after a tab switch)", () => {
    const b = box("a", 100, 0);
    step([b], bounds, 10);
    expect(b.y).toBeLessThan(10);
  });

  it("leaves held and placed bodies where they are", () => {
    const held = { ...box("a", 100, 100), held: true };
    const placed = { ...box("b", 400, 100), placed: true };
    run([held, placed], 1);
    expect(held.y).toBe(100);
    expect(placed.y).toBe(100);
  });
});

describe("separate", () => {
  it("never moves a held body", () => {
    const held = { ...box("a", 100, 100), held: true };
    const other = box("b", 150, 120);
    separate(held, other);
    expect(held.x).toBe(100);
    expect(overlaps(held, other)).toBe(false);
  });
});

describe("explode", () => {
  it("sends every body upward", () => {
    const bodies = [box("a", 0, 0), box("b", 200, 0)];
    explode(bodies, () => 0.5);
    for (const b of bodies) expect(b.vy).toBeLessThan(0);
  });
});

describe("trySnap", () => {
  it("snaps a close, upright card exactly home and reports the offset", () => {
    const b = box("a", 100, 100);
    b.x += 6;
    b.y += 8;
    expect(trySnap(b)).toBe(10);
    expect(b.placed).toBe(true);
    expect(distanceFromHome(b)).toBe(0);
  });

  it("refuses far or tilted cards", () => {
    const far = box("a", 100, 100);
    far.x += 80;
    expect(trySnap(far)).toBeNull();
    const tilted = box("b", 100, 100);
    tilted.angle = 0.6;
    expect(trySnap(tilted)).toBeNull();
  });
});

describe("throwVelocity", () => {
  it("measures px per second and clamps extremes", () => {
    expect(
      throwVelocity([
        { x: 0, y: 0, t: 0 },
        { x: 100, y: -50, t: 100 },
      ]),
    ).toEqual({ vx: 1000, vy: -500 });
    expect(
      throwVelocity([
        { x: 0, y: 0, t: 0 },
        { x: 9000, y: 0, t: 10 },
      ]).vx,
    ).toBe(2500);
    expect(throwVelocity([])).toEqual({ vx: 0, vy: 0 });
  });
});

describe("tilt", () => {
  it("never tilts a falling card past the cap", () => {
    const b = box("a", 100, 0);
    b.va = 50;
    run([b], 0.5);
    expect(Math.abs(b.angle)).toBeLessThanOrEqual(0.3 + 1e-9);
  });
});
