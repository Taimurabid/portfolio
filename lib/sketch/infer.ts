/**
 * Sketch → layout inference. Takes the boxes a visitor drew and works out what
 * a designer means by them: nesting, rows vs columns, gap and padding on a 4px
 * scale, how each child sizes itself, and what each leaf box probably is.
 * Pure and deterministic, so it's unit-tested.
 */
export type Rect = { id: string; x: number; y: number; w: number; h: number };
export type Role =
  "card" | "stack" | "row" | "heading" | "text" | "button" | "avatar" | "image" | "box";
/** "auto" = sized by its content (buttons); "fill" = takes the available space. */
export type Size =
  | { kind: "auto" }
  | { kind: "fill" }
  | { kind: "px"; value: number }
  | { kind: "pct"; value: number };
export type Padding = [top: number, right: number, bottom: number, left: number];

export type Node = {
  id: string;
  role: Role;
  layout: "row" | "col" | null;
  gap: number;
  padding: Padding;
  width: Size;
  height: number | null;
  children: Node[];
};

type Tree = { rect: Rect; kids: Tree[] };

const TOLERANCE = 4;
const area = (r: Rect) => r.w * r.h;
export const snap4 = (n: number) => Math.max(0, Math.round(n / 4) * 4);

function median(values: number[]): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)]!;
}

function bbox(rects: Rect[]): Rect {
  const x = Math.min(...rects.map((r) => r.x));
  const y = Math.min(...rects.map((r) => r.y));
  const right = Math.max(...rects.map((r) => r.x + r.w));
  const bottom = Math.max(...rects.map((r) => r.y + r.h));
  return { id: "bbox", x, y, w: right - x, h: bottom - y };
}

function contains(outer: Rect, inner: Rect): boolean {
  return (
    outer !== inner &&
    area(outer) > area(inner) &&
    inner.x >= outer.x - TOLERANCE &&
    inner.y >= outer.y - TOLERANCE &&
    inner.x + inner.w <= outer.x + outer.w + TOLERANCE &&
    inner.y + inner.h <= outer.y + outer.h + TOLERANCE
  );
}

/** What a leaf box most likely is, judged by its proportions. */
export function classify({ w, h }: Pick<Rect, "w" | "h">): Role {
  const ratio = w / h;
  if (Math.abs(ratio - 1) <= 0.2 && w <= 96) return "avatar";
  if (h <= 24 && ratio >= 3) return "text";
  if (h <= 56 && ratio >= 4) return "heading";
  if (h >= 24 && h <= 56 && ratio >= 1.6 && w <= 200) return "button";
  if (w >= 80 && h >= 60) return "image";
  return "box";
}

/** Nests every box inside the smallest box that contains it. */
function buildTree(rects: Rect[]): Tree[] {
  const sorted = [...rects].sort((a, b) => area(b) - area(a));
  const trees = new Map(sorted.map((r) => [r.id, { rect: r, kids: [] as Tree[] }]));
  const roots: Tree[] = [];
  for (const r of sorted) {
    const parents = sorted.filter((p) => contains(p, r));
    const parent = parents.sort((a, b) => area(a) - area(b))[0];
    (parent ? trees.get(parent.id)!.kids : roots).push(trees.get(r.id)!);
  }
  return roots;
}

/** Groups siblings into rows: boxes that overlap vertically by half share a row. */
export function rowsOf<T extends { rect: Rect }>(items: T[]): T[][] {
  const rows: T[][] = [];
  for (const item of [...items].sort((a, b) => a.rect.y - b.rect.y)) {
    const row = rows[rows.length - 1];
    if (row) {
      const span = bbox(row.map((i) => i.rect));
      const overlap =
        Math.min(span.y + span.h, item.rect.y + item.rect.h) - Math.max(span.y, item.rect.y);
      const smallest = Math.min(item.rect.h, ...row.map((i) => i.rect.h));
      if (overlap >= smallest * 0.5) {
        row.push(item);
        continue;
      }
    }
    rows.push([item]);
  }
  return rows.map((row) => row.sort((a, b) => a.rect.x - b.rect.x));
}

function sizeIn(rect: Rect, role: Role, layout: "row" | "col", contentWidth: number): Size {
  if (role === "button") return { kind: "auto" };
  if (layout === "row") {
    return role === "avatar" || rect.w <= 120
      ? { kind: "px", value: snap4(rect.w) }
      : { kind: "fill" };
  }
  if (rect.w >= contentWidth * 0.85) return { kind: "fill" };
  if (role === "text" || role === "heading") {
    return { kind: "pct", value: Math.min(100, Math.round((rect.w / contentWidth) * 20) * 5) };
  }
  return { kind: "px", value: snap4(rect.w) };
}

function leaf(t: Tree, layout: "row" | "col", contentWidth: number): Node {
  const role = classify(t.rect);
  const height = role === "image" || role === "box" || role === "avatar" ? snap4(t.rect.h) : null;
  return {
    id: t.rect.id,
    role,
    layout: null,
    gap: 0,
    padding: [0, 0, 0, 0],
    width: sizeIn(t.rect, role, layout, contentWidth),
    height,
    children: [],
  };
}

function container(id: string, rect: Rect, kids: Tree[], framed: boolean, role: Role): Node {
  const inner = bbox(kids.map((k) => k.rect));
  const padding: Padding = framed
    ? [
        snap4(inner.y - rect.y),
        snap4(rect.x + rect.w - inner.x - inner.w),
        snap4(rect.y + rect.h - inner.y - inner.h),
        snap4(inner.x - rect.x),
      ]
    : [0, 0, 0, 0];
  const contentWidth = rect.w - padding[1] - padding[3];
  const rows = rowsOf(kids);
  const place = (k: Tree, layout: "row" | "col") =>
    k.kids.length
      ? {
          ...container(k.rect.id, k.rect, k.kids, true, "card"),
          width: sizeIn(k.rect, "card", layout, contentWidth),
        }
      : leaf(k, layout, contentWidth);

  if (rows.length === 1) {
    const row = rows[0]!;
    const gaps = row.slice(1).map((k, i) => k.rect.x - (row[i]!.rect.x + row[i]!.rect.w));
    return {
      id,
      role,
      layout: "row",
      gap: snap4(median(gaps)),
      padding,
      width: { kind: "fill" },
      height: null,
      children: row.map((k) => place(k, "row")),
    };
  }

  const spans = rows.map((row) => bbox(row.map((k) => k.rect)));
  const gaps = spans.slice(1).map((s, i) => s.y - (spans[i]!.y + spans[i]!.h));
  const children = rows.map((row, i) => {
    if (row.length === 1) return place(row[0]!, "col");
    const rowGaps = row.slice(1).map((k, j) => k.rect.x - (row[j]!.rect.x + row[j]!.rect.w));
    const node: Node = {
      id: `row-${i}`,
      role: "row",
      layout: "row",
      gap: snap4(median(rowGaps)),
      padding: [0, 0, 0, 0],
      width: { kind: "fill" },
      height: null,
      children: row.map((k) => place(k, "row")),
    };
    return node;
  });
  return {
    id,
    role,
    layout: "col",
    gap: snap4(median(gaps)),
    padding,
    width: { kind: "fill" },
    height: null,
    children,
  };
}

/** The whole sketch as one component tree, or null if nothing is drawn. */
export function infer(rects: Rect[]): Node | null {
  if (!rects.length) return null;
  const roots = buildTree(rects);
  if (roots.length === 1) {
    const only = roots[0]!;
    return only.kids.length
      ? container(only.rect.id, only.rect, only.kids, true, "card")
      : leaf(only, "col", only.rect.w);
  }
  return container("root", bbox(roots.map((r) => r.rect)), roots, false, "stack");
}
