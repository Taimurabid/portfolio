import type { CSSProperties } from "react";
import type { Node } from "@/lib/sketch/infer";

type Parent = "row" | "col" | null;

/** Inline styles mirror the generated Tailwind classes, tinted with the site's tokens. */
function styleFor(node: Node, parent: Parent): CSSProperties {
  const s: CSSProperties = {};
  if (node.layout) {
    Object.assign(s, {
      display: "flex",
      flexDirection: node.layout === "row" ? "row" : "column",
      gap: node.gap,
    });
    if (node.layout === "row") s.alignItems = "center";
  }
  const [t, r, b, l] = node.padding;
  if (t || r || b || l) s.padding = `${t}px ${r}px ${b}px ${l}px`;
  const w = node.width;
  if (w.kind === "fill" && parent === "row") Object.assign(s, { flex: "1 1 0", minWidth: 0 });
  if (w.kind === "px") Object.assign(s, { width: w.value, maxWidth: "100%" });
  if (w.kind === "pct") s.width = `${w.value}%`;
  if (parent === "row" && w.kind !== "fill") s.flexShrink = 0;
  if (node.role === "button" && parent === "col") s.alignSelf = "flex-start";
  if (node.height) s.height = node.height;
  if (node.role === "avatar" && node.height)
    Object.assign(s, { width: node.height, height: node.height });
  return s;
}

const ROLE: Record<Node["role"], string> = {
  card: "rounded-2xl border border-border bg-surface shadow-card",
  stack: "",
  row: "",
  heading: "text-lg font-semibold",
  text: "text-sm text-muted",
  button: "rounded-full bg-segment px-4 py-2 text-sm font-medium text-segment-fg",
  avatar: "rounded-full bg-accent",
  image: "rounded-xl bg-linear-to-br from-chip to-faint/40",
  box: "rounded-lg bg-chip",
};

const TEXT: Partial<Record<Node["role"], string>> = {
  heading: "Heading",
  text: "Supporting text",
  button: "Button",
};

export function ComponentPreview({ node, parent = null }: { node: Node; parent?: Parent }) {
  const props = { className: ROLE[node.role], style: styleFor(node, parent) };
  const text = TEXT[node.role];
  if (node.role === "heading") return <p {...props}>{text}</p>;
  if (node.role === "text") return <p {...props}>{text}</p>;
  if (node.role === "button") return <span {...props}>{text}</span>;
  return (
    <div {...props}>
      {node.children.map((child) => (
        <ComponentPreview key={child.id} node={child} parent={node.layout} />
      ))}
    </div>
  );
}
