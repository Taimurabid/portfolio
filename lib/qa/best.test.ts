import { describe, expect, it } from "vitest";
import { readBest, saveIfBest } from "./best";

function memory() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

describe("best time", () => {
  it("starts empty and saves the first result", () => {
    const storage = memory();
    expect(readBest(storage)).toBeNull();
    expect(saveIfBest(42_400, storage)).toBe(true);
    expect(readBest(storage)).toBe(42_400);
  });

  it("only replaces the best with a faster time", () => {
    const storage = memory();
    saveIfBest(30_000, storage);
    expect(saveIfBest(31_000, storage)).toBe(false);
    expect(readBest(storage)).toBe(30_000);
    expect(saveIfBest(25_000, storage)).toBe(true);
    expect(readBest(storage)).toBe(25_000);
  });

  it("copes with missing or broken storage", () => {
    expect(readBest(null)).toBeNull();
    expect(saveIfBest(10_000, null)).toBe(true);
    const throwing = {
      getItem: () => {
        throw new Error("blocked");
      },
      setItem: () => {
        throw new Error("blocked");
      },
    };
    expect(readBest(throwing)).toBeNull();
    expect(saveIfBest(10_000, throwing)).toBe(true);
  });

  it("ignores garbage values", () => {
    const storage = memory();
    storage.setItem("qa-best-ms", "not a number");
    expect(readBest(storage)).toBeNull();
  });
});
