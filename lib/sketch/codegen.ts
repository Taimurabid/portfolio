/**
 * Inferred layout → a real React + Tailwind component, as source text.
 * Uses Tailwind's default palette so the code works in any project.
 */
import type { Node, Padding, Size } from "./infer";

const n = (px: number) => px / 4;

/** Shortest Tailwind padding: shared value first, then only the sides that differ. */
export function paddingClasses([t, r, b, l]: Padding): string[] {
  if (t === r && r === b && b === l) return t ? [`p-${n(t)}`] : [];
  if (t === b && l === r) return [l ? `px-${n(l)}` : "", t ? `py-${n(t)}` : ""].filter(Boolean);
  const sides = [
    ["t", t],
    ["r", r],
    ["b", b],
    ["l", l],
  ] as const;
  const counts = new Map<number, number>();
  for (const [, v] of sides) counts.set(v, (counts.get(v) ?? 0) + 1);
  const [base, times] = [...counts].sort((a, c) => c[1] - a[1])[0]!;
  if (times < 3) return sides.filter(([, v]) => v).map(([k, v]) => `p${k}-${n(v)}`);
  return [
    base ? `p-${n(base)}` : "",
    ...sides.filter(([, v]) => v !== base).map(([k, v]) => `p${k}-${n(v)}`),
  ].filter(Boolean);
}

function widthClasses(width: Size, parent: "row" | "col" | null): string[] {
  if (width.kind === "auto") return parent === "row" ? ["shrink-0"] : [];
  if (width.kind === "fill") return parent === "row" ? ["flex-1"] : [];
  if (width.kind === "pct") return [`w-[${width.value}%]`];
  return [`w-[${width.value}px]`, ...(parent === "row" ? ["shrink-0"] : [])];
}

const ROLE: Record<Node["role"], string[]> = {
  card: ["rounded-2xl", "border", "border-neutral-200", "bg-white"],
  stack: [],
  row: [],
  heading: ["text-lg", "font-semibold", "text-neutral-900"],
  text: ["text-sm", "text-neutral-600"],
  button: [
    "rounded-full",
    "bg-neutral-900",
    "px-4",
    "py-2",
    "text-sm",
    "font-medium",
    "text-white",
  ],
  avatar: ["rounded-full", "bg-neutral-200"],
  image: ["rounded-xl", "bg-neutral-200"],
  box: ["rounded-lg", "bg-neutral-100"],
};

const TAG: Partial<Record<Node["role"], string>> = { heading: "h3", text: "p", button: "button" };
const TEXT: Partial<Record<Node["role"], string>> = {
  heading: "Heading",
  text: "Supporting text",
  button: "Button",
};

/** Tailwind classes for one node, given its parent's layout direction. */
export function classesFor(node: Node, parent: "row" | "col" | null): string {
  const layout =
    node.layout === "row"
      ? ["flex", "items-center"]
      : node.layout === "col"
        ? ["flex", "flex-col"]
        : [];
  const gap = node.layout && node.gap ? [`gap-${n(node.gap)}`] : [];
  const size =
    node.role === "avatar" && node.height
      ? [`size-[${node.height}px]`, ...(parent === "row" ? ["shrink-0"] : [])]
      : [...widthClasses(node.width, parent), ...(node.height ? [`h-[${node.height}px]`] : [])];
  const selfStart = node.role === "button" && parent === "col" ? ["self-start"] : [];
  return [
    ...layout,
    ...gap,
    ...paddingClasses(node.padding),
    ...size,
    ...selfStart,
    ...ROLE[node.role],
  ].join(" ");
}

function render(node: Node, parent: "row" | "col" | null, depth: number): string[] {
  const pad = "  ".repeat(depth);
  const tag = TAG[node.role] ?? "div";
  const attrs = `${tag === "button" ? ' type="button"' : ""} className="${classesFor(node, parent)}"`;
  const text = TEXT[node.role];
  if (text) return [`${pad}<${tag}${attrs}>${text}</${tag}>`];
  if (!node.children.length) return [`${pad}<${tag}${attrs} />`];
  return [
    `${pad}<${tag}${attrs}>`,
    ...node.children.flatMap((child) => render(child, node.layout, depth + 1)),
    `${pad}</${tag}>`,
  ];
}

export function toJsx(node: Node): string {
  return [
    "export function SketchedComponent() {",
    "  return (",
    ...render(node, null, 2),
    "  );",
    "}",
    "",
  ].join("\n");
}
