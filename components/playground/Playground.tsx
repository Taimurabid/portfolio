"use client";

import { useMemo, useState } from "react";
import { toJsx } from "@/lib/sketch/codegen";
import { examples } from "@/lib/sketch/examples";
import { infer, type Node, type Rect, type Role } from "@/lib/sketch/infer";
import { CodePanel } from "./CodePanel";
import { ComponentPreview } from "./ComponentPreview";
import { SketchCanvas } from "./SketchCanvas";

function rolesOf(node: Node | null, map = new Map<string, Role>()): Map<string, Role> {
  if (!node) return map;
  map.set(node.id, node.role);
  node.children.forEach((child) => rolesOf(child, map));
  return map;
}

/** Plain-language read-out of what the inference saw (also announced to screen readers). */
function summarise(node: Node | null): string {
  if (!node) return "Draw a box to start. Draw smaller boxes inside it.";
  const direction =
    node.layout === "row" ? "a row" : node.layout === "col" ? "a column" : "a single element";
  const [t, r, b, l] = node.padding;
  const padding =
    t || r || b || l
      ? `, padding ${new Set([t, r, b, l]).size === 1 ? `${t}px` : `${t}/${r}/${b}/${l}px`}`
      : "";
  const gap = node.layout && node.gap ? `, gap ${node.gap}px` : "";
  return `Read as ${direction} of ${node.children.length || 1} ${node.children.length === 1 ? "item" : "items"}${gap}${padding}.`;
}

const tool =
  "inline-flex h-8 items-center rounded-full px-3 text-xs transition-colors hover:bg-chip disabled:opacity-40";

export default function Playground() {
  const [history, setHistory] = useState<Rect[][]>([examples[0]!.rects]);
  const [selected, setSelected] = useState<string | null>(null);
  const rects = history[history.length - 1]!;
  const commit = (next: Rect[]) => setHistory((h) => [...h, next].slice(-50));

  const tree = useMemo(() => infer(rects), [rects]);
  const roles = useMemo(() => rolesOf(tree), [tree]);
  const code = useMemo(() => (tree ? toJsx(tree) : ""), [tree]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card p-3 sm:p-4">
        <div
          role="toolbar"
          aria-label="Sketch tools"
          className="mb-3 flex flex-wrap items-center gap-1"
        >
          {examples.map((example) => (
            <button
              key={example.name}
              type="button"
              className={`${tool} border border-border`}
              onClick={() => commit(example.rects)}
            >
              {example.name}
            </button>
          ))}
          <span className="ml-auto" />
          <button
            type="button"
            className={tool}
            disabled={history.length < 2}
            onClick={() => setHistory((h) => h.slice(0, -1))}
          >
            Undo
          </button>
          <button
            type="button"
            className={tool}
            disabled={!rects.length}
            onClick={() => commit([])}
          >
            Clear
          </button>
        </div>
        <SketchCanvas
          rects={rects}
          roles={roles}
          selected={selected}
          onSelect={setSelected}
          onDraw={(rect) => commit([...rects, { ...rect, id: `box-${Date.now()}` }])}
          onDelete={() => {
            commit(rects.filter((r) => r.id !== selected));
            setSelected(null);
          }}
        />
        <p role="status" className="mt-3 text-sm text-muted">
          {summarise(tree)}
        </p>
      </div>

      <div className="flex min-w-0 flex-col gap-4">
        <div className="min-h-[200px] card p-4 sm:p-6">
          <p className="mb-4 text-xs font-medium tracking-widest text-muted uppercase">
            Live preview
          </p>
          {tree ? (
            <ComponentPreview node={tree} />
          ) : (
            <p className="text-sm text-muted">Nothing drawn yet.</p>
          )}
        </div>
        {code ? <CodePanel code={code} /> : null}
      </div>
    </div>
  );
}
