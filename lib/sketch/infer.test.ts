import { describe, expect, it } from "vitest";
import { classesFor, paddingClasses, toJsx } from "./codegen";
import { examples } from "./examples";
import { classify, infer, rowsOf, snap4, type Node, type Rect } from "./infer";

const sketch = (name: string) => examples.find((e) => e.name === name)!.rects;
const roles = (node: Node): unknown =>
  node.children.length ? { [node.role]: node.children.map(roles) } : node.role;

describe("classify", () => {
  it.each([
    [{ w: 56, h: 56 }, "avatar"],
    [{ w: 300, h: 16 }, "text"],
    [{ w: 200, h: 40 }, "heading"],
    [{ w: 120, h: 44 }, "button"],
    [{ w: 300, h: 160 }, "image"],
    [{ w: 40, h: 120 }, "box"],
  ] as const)("%o is a %s", (size, role) => {
    expect(classify(size)).toBe(role);
  });
});

describe("rowsOf", () => {
  const item = (id: string, x: number, y: number, w: number, h: number) => ({
    rect: { id, x, y, w, h } as Rect,
  });

  it("puts vertically overlapping boxes in one row, sorted left to right", () => {
    const rows = rowsOf([
      item("b", 200, 10, 50, 40),
      item("a", 0, 0, 50, 50),
      item("c", 0, 100, 50, 20),
    ]);
    expect(rows.map((r) => r.map((i) => i.rect.id))).toEqual([["a", "b"], ["c"]]);
  });
});

describe("infer", () => {
  it("returns null for an empty canvas", () => {
    expect(infer([])).toBeNull();
  });

  it("reads the profile card: avatar + name row, two text lines, a button", () => {
    const node = infer(sketch("Profile card"))!;
    expect(roles(node)).toEqual({
      card: [{ row: ["avatar", "heading"] }, "text", "text", "button"],
    });
    expect(node.layout).toBe("col");
    expect(node.padding).toEqual([24, 24, 24, 24]);
  });

  it("reads the media card, with the two buttons side by side", () => {
    const node = infer(sketch("Media card"))!;
    expect(roles(node)).toEqual({
      card: ["image", "heading", "text", { row: ["button", "button"] }],
    });
    expect(node.padding).toEqual([16, 16, 16, 16]);
  });

  it("wraps separate top-level boxes in a row and lets them share the width", () => {
    const node = infer(sketch("Stats row"))!;
    expect(node.role).toBe("stack");
    expect(node.layout).toBe("row");
    expect(node.gap).toBe(12);
    expect(node.children.every((c) => c.role === "card" && c.width.kind === "fill")).toBe(true);
  });

  it("snaps spacing to the 4px scale", () => {
    expect([snap4(13), snap4(18), snap4(-3)]).toEqual([12, 20, 0]);
  });
});

describe("toJsx", () => {
  const code = toJsx(infer(sketch("Profile card"))!);

  it("writes a component with Tailwind classes for layout, spacing and roles", () => {
    expect(code).toContain("export function SketchedComponent()");
    expect(code).toContain(
      'className="flex flex-col gap-6 p-6 rounded-2xl border border-neutral-200 bg-white"',
    );
    expect(code).toContain("size-[56px] shrink-0 rounded-full");
    expect(code).toContain('<button type="button" className="self-start rounded-full');
    expect(code).not.toMatch(/<button[^>]*w-\[/); // buttons size to their label
  });

  it("produces balanced tags", () => {
    const opened = (code.match(/<(div|h3|p|button)\b[^/]*?>/g) ?? []).length;
    const closed = (code.match(/<\/(div|h3|p|button)>/g) ?? []).length;
    expect(opened).toBe(closed);
  });

  it("uses flex-1 for fluid items in a row and w-[%] for short text in a column", () => {
    const profile = infer(sketch("Profile card"))!;
    const secondLine = profile.children[2]!; // 256 of 352px
    expect(classesFor(secondLine, "col")).toContain("w-[75%]");
    const mediaBody = infer(sketch("Media card"))!.children[2]!; // 87% wide counts as full width
    expect(classesFor(mediaBody, "col")).not.toMatch(/w-\[/);
    const stats = infer(sketch("Stats row"))!;
    expect(classesFor(stats.children[0]!, "row")).toContain("flex-1");
  });
});

describe("paddingClasses", () => {
  it("writes the shortest form a developer would", () => {
    expect(paddingClasses([24, 24, 24, 24])).toEqual(["p-6"]);
    expect(paddingClasses([8, 16, 8, 16])).toEqual(["px-4", "py-2"]);
    expect(paddingClasses([24, 24, 56, 24])).toEqual(["p-6", "pb-14"]);
    expect(paddingClasses([0, 0, 0, 0])).toEqual([]);
    expect(paddingClasses([4, 8, 12, 16])).toEqual(["pt-1", "pr-2", "pb-3", "pl-4"]);
  });
});
