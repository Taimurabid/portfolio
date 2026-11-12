import { describe, expect, it } from "vitest";
import { bugs, cssValue, diffLines, formatTime, isFixed, nudge, type Bug } from "./bugs";

const byId = (id: string) => bugs.find((bug) => bug.id === id) as Bug;

describe("bug definitions", () => {
  it("has five bugs with unique ids and targets", () => {
    expect(bugs).toHaveLength(5);
    expect(new Set(bugs.map((b) => b.id)).size).toBe(5);
    expect(new Set(bugs.map((b) => b.target)).size).toBe(5);
  });

  it("starts every bug off-spec and makes every fix reachable", () => {
    for (const bug of bugs) {
      expect(isFixed(bug, bug.wrong)).toBe(false);
      if (bug.kind === "number") {
        expect(Math.abs(bug.correct - bug.wrong) % bug.step).toBe(0);
        expect(bug.correct).toBeGreaterThanOrEqual(bug.min);
        expect(bug.correct).toBeLessThanOrEqual(bug.max);
      } else {
        expect(bug.options).toContain(bug.correct);
        expect(bug.options).toContain(bug.wrong);
      }
    }
  });
});

describe("nudge", () => {
  it("steps by the bug's step and clamps to its range", () => {
    const weight = byId("weight");
    expect(nudge(weight, 640, -1)).toBe(600);
    expect(nudge(weight, 800, 1)).toBe(800);
    expect(nudge(byId("offset"), -12, -1)).toBe(-12);
  });

  it("reaches the spec value from the planted one", () => {
    const radius = byId("radius");
    let value = radius.wrong;
    for (let i = 0; i < 6; i++) value = nudge(radius, value, -1);
    expect(isFixed(radius, value)).toBe(true);
  });

  it("leaves colour bugs alone", () => {
    expect(nudge(byId("accent"), "#e4572e", 1)).toBe("#e4572e");
  });
});

describe("formatting", () => {
  it("writes CSS values with units", () => {
    expect(cssValue(byId("gap"), 17)).toBe("17px");
    expect(cssValue(byId("weight"), 520)).toBe("520");
  });

  it("builds the pull-request diff", () => {
    expect(diffLines(byId("radius"))).toEqual(["- border-radius: 20px;", "+ border-radius: 14px;"]);
  });

  it("formats elapsed time", () => {
    expect(formatTime(102_000)).toBe("1:42");
    expect(formatTime(5_400)).toBe("0:05");
    expect(formatTime(-1)).toBe("0:00");
  });
});
