"use client";

import { useRef, useState, type PointerEvent } from "react";
import { CANVAS } from "@/lib/sketch/examples";
import type { Rect, Role } from "@/lib/sketch/infer";

type SketchCanvasProps = {
  rects: Rect[];
  roles: Map<string, Role>;
  selected: string | null;
  onDraw: (rect: Omit<Rect, "id">) => void;
  onSelect: (id: string | null) => void;
  onDelete: () => void;
};

const GRID = 8;
const MIN = 16;
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/** Drag to draw boxes on a 480×360 grid; click a box to select it. */
export function SketchCanvas({
  rects,
  roles,
  selected,
  onDraw,
  onSelect,
  onDelete,
}: SketchCanvasProps) {
  const ref = useRef<HTMLDivElement>(null);
  // A drag always draws (so boxes can be drawn inside boxes); a click without a drag selects.
  const start = useRef<{ x: number; y: number; target: string | null } | null>(null);
  const [draft, setDraft] = useState<Omit<Rect, "id"> | null>(null);

  const toGrid = (e: PointerEvent) => {
    const box = ref.current!.getBoundingClientRect();
    const snap = (v: number, max: number) =>
      Math.max(0, Math.min(max, Math.round(v / GRID) * GRID));
    return {
      x: snap(((e.clientX - box.left) / box.width) * CANVAS.width, CANVAS.width),
      y: snap(((e.clientY - box.top) / box.height) * CANVAS.height, CANVAS.height),
    };
  };

  const down = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { ...toGrid(e), target: (e.target as HTMLElement).dataset.id ?? null };
  };

  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (!start.current) return;
    const p = toGrid(e);
    const s = start.current;
    setDraft({
      x: Math.min(s.x, p.x),
      y: Math.min(s.y, p.y),
      w: Math.abs(p.x - s.x),
      h: Math.abs(p.y - s.y),
    });
  };

  const up = () => {
    if (draft && draft.w >= MIN && draft.h >= MIN) onDraw(draft);
    else onSelect(start.current?.target ?? null);
    start.current = null;
    setDraft(null);
  };

  return (
    <div
      ref={ref}
      tabIndex={0}
      role="application"
      aria-label="Sketch canvas. Drag to draw a box, including inside another box. Click a box and press Delete to remove it."
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onKeyDown={(e) => {
        if ((e.key === "Delete" || e.key === "Backspace") && selected) onDelete();
        if (e.key === "Escape") onSelect(null);
      }}
      className="relative aspect-[4/3] w-full cursor-crosshair touch-none overflow-hidden rounded-[9px] bg-chip/50 [background-image:radial-gradient(var(--color-faint)_1px,transparent_1.2px)] [background-size:calc(100%/30)_calc(100%/22.5)] select-none"
    >
      {rects.map((r) => (
        <div
          key={r.id}
          data-id={r.id}
          className={`absolute rounded-[4px] border-[1.5px] bg-accent/[0.06] ${r.id === selected ? "border-solid border-accent" : "border-dashed border-faint"}`}
          style={{
            left: pct(r.x, CANVAS.width),
            top: pct(r.y, CANVAS.height),
            width: pct(r.w, CANVAS.width),
            height: pct(r.h, CANVAS.height),
          }}
        >
          <span className="pointer-events-none absolute top-0.5 left-1 font-mono text-[10px] leading-none text-muted">
            {roles.get(r.id) ?? ""}
          </span>
        </div>
      ))}
      {draft ? (
        <div
          aria-hidden="true"
          className="absolute rounded-[4px] border-[1.5px] border-accent bg-accent/10"
          style={{
            left: pct(draft.x, CANVAS.width),
            top: pct(draft.y, CANVAS.height),
            width: pct(draft.w, CANVAS.width),
            height: pct(draft.h, CANVAS.height),
          }}
        />
      ) : null}
    </div>
  );
}
