import { describe, expect, it } from "vitest";
import { toHex, tokenFor } from "./inspect";

describe("toHex", () => {
  it("normalises rgb() and hex", () => {
    expect(toHex("rgb(222, 99, 29)")).toBe("#de631d");
    expect(toHex(" #DE631D ")).toBe("#de631d");
    expect(toHex("rgba(0, 0, 0, 0.5)")).toBe("#000000");
  });

  it("treats transparent and unknown values as no colour", () => {
    expect(toHex("rgba(0, 0, 0, 0)")).toBeNull();
    expect(toHex("transparent")).toBeNull();
  });
});

describe("tokenFor", () => {
  const tokens = { accent: "#de631d", card: " #f5f3ef" };

  it("names the matching token", () => {
    expect(tokenFor("#de631d", tokens)).toBe("--accent");
    expect(tokenFor("#f5f3ef", tokens)).toBe("--card");
  });

  it("returns null for off-palette colours (that's the accent bug's tell)", () => {
    expect(tokenFor("#e4572e", tokens)).toBeNull();
  });
});
