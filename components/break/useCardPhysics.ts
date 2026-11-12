"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useClock } from "@/lib/motion";
import {
  createBody,
  explode,
  step,
  throwVelocity,
  trySnap,
  type Body,
  type Bounds,
} from "@/lib/physics";

type Sample = { x: number; y: number; t: number };

const transformOf = (b: Body) =>
  b.placed ? "" : `translate(${b.x - b.homeX}px, ${b.y - b.homeY}px) rotate(${b.angle}rad)`;

/**
 * Knocks every card in `selector` loose and lets the visitor drag them back.
 * Cards stay in the DOM and grid; only an inline transform moves them, so the
 * layout underneath never shifts and cleanup is just removing that style.
 */
export function useCardPhysics(selector: string) {
  const bodies = useRef<Body[]>([]);
  const elements = useRef(new Map<string, HTMLElement>());
  const bounds = useRef<Bounds>({ left: 0, right: 0, floor: 0 });
  const offsets = useRef<number[]>([]);
  const [placed, setPlaced] = useState(0);
  const [total, setTotal] = useState(0);

  const render = useCallback(() => {
    for (const b of bodies.current) {
      const el = elements.current.get(b.id);
      if (el) el.style.transform = transformOf(b);
    }
  }, []);

  useEffect(() => {
    const cards = [...document.querySelectorAll<HTMLElement>(selector)];
    bounds.current = {
      left: window.scrollX + 8,
      right: window.scrollX + window.innerWidth - 8,
      floor: window.scrollY + window.innerHeight - 8,
    };
    bodies.current = cards.map((el, i) => {
      const r = el.getBoundingClientRect();
      elements.current.set(String(i), el);
      el.dataset.broken = "";
      el.style.zIndex = String(40 + i);
      return createBody(String(i), {
        x: r.left + window.scrollX,
        y: r.top + window.scrollY,
        w: r.width,
        h: r.height,
      });
    });
    setTotal(cards.length);
    explode(bodies.current);

    const cleanups = cards.map((el, i) => attachDrag(el, () => bodies.current[i]!));
    const map = elements.current;
    return () => {
      cleanups.forEach((fn) => fn());
      for (const el of map.values()) {
        delete el.dataset.broken;
        el.style.removeProperty("transform");
        el.style.removeProperty("transition");
        el.style.removeProperty("z-index");
      }
      map.clear();
    };

    function attachDrag(el: HTMLElement, body: () => Body) {
      let grab = { dx: 0, dy: 0 };
      let samples: Sample[] = [];
      const down = (e: PointerEvent) => {
        const b = body();
        if (b.placed) return;
        e.preventDefault();
        try {
          el.setPointerCapture(e.pointerId);
        } catch {
          // Some pointers (e.g. synthetic or pen hover) can't be captured; dragging still works.
        }
        b.held = true;
        grab = { dx: e.pageX - b.x, dy: e.pageY - b.y };
        samples = [{ x: e.pageX, y: e.pageY, t: e.timeStamp }];
      };
      const move = (e: PointerEvent) => {
        const b = body();
        if (!b.held) return;
        b.x = e.pageX - grab.dx;
        b.y = e.pageY - grab.dy;
        samples = [...samples, { x: e.pageX, y: e.pageY, t: e.timeStamp }].slice(-5);
      };
      const up = () => {
        const b = body();
        if (!b.held) return;
        b.held = false;
        const off = trySnap(b);
        if (off === null) {
          Object.assign(b, throwVelocity(samples));
          return;
        }
        el.style.transition = "transform 180ms cubic-bezier(0.2, 0.7, 0.2, 1)";
        offsets.current.push(off);
        setPlaced((n) => n + 1);
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      return () => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
      };
    }
  }, [selector]);

  useClock((_, delta) => {
    if (bodies.current.every((b) => b.placed)) return;
    step(bodies.current, bounds.current, delta / 1000);
    render();
  });

  /** Glides every card home (the "put it back for me" button). */
  const restoreAll = useCallback(() => {
    for (const b of bodies.current) {
      const el = elements.current.get(b.id);
      if (el && !b.placed) el.style.transition = "transform 600ms cubic-bezier(0.2, 0.7, 0.2, 1)";
      Object.assign(b, { held: false, placed: true, x: b.homeX, y: b.homeY, angle: 0 });
    }
    render();
  }, [render]);

  const averageOffset = () => {
    const all = offsets.current;
    return all.length ? Math.round(all.reduce((sum, n) => sum + n, 0) / all.length) : 0;
  };

  return { placed, total, restoreAll, averageOffset };
}
