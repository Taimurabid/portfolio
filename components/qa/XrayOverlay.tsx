"use client";

import { useEffect, useState } from "react";

type Padding = [top: number, right: number, bottom: number, left: number];
type Box = { top: number; left: number; width: number; height: number; pad: Padding };

function measure(el: Element): Box {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const side = (s: string) => parseFloat(cs.getPropertyValue(`padding-${s}`)) || 0;
  const pad: Padding = [side("top"), side("right"), side("bottom"), side("left")];
  return { top: r.top, left: r.left, width: r.width, height: r.height, pad };
}

/** Figma-style redline box (with padding shaded) that follows an element. */
export function XrayOverlay({ el, selected }: { el: Element; selected?: boolean }) {
  const [box, setBox] = useState<Box>(() => measure(el));

  useEffect(() => {
    let frame = 0;
    const loop = () => {
      setBox(measure(el));
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [el]);

  const [pt, pr, pb, pl] = box.pad;
  const name = el.getAttribute("data-inspect") ?? el.tagName.toLowerCase();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[60]"
      style={{ top: box.top, left: box.left, width: box.width, height: box.height }}
    >
      <div
        className={`absolute inset-0 rounded-[2px] ${selected ? "outline-2 outline-[#e0398f] outline-solid" : "outline-1 outline-[#e0398f]/80 outline-dashed"}`}
        style={{ background: "rgb(224 57 143 / 0.06)" }}
      />
      {pt + pr + pb + pl > 0 ? (
        <div
          className="absolute outline-1 outline-[#2f80ed]/70 outline-dashed"
          style={{ top: pt, right: pr, bottom: pb, left: pl }}
        />
      ) : null}
      <span className="absolute -top-6 left-0 rounded bg-[#e0398f] px-1.5 py-0.5 font-mono text-[11px] whitespace-nowrap text-white">
        {name} · {Math.round(box.width)}×{Math.round(box.height)}
      </span>
    </div>
  );
}
