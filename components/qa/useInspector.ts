"use client";

import { useCallback, useEffect, useState } from "react";

const INSPECT = "[data-inspect]";
const UI = "[data-qa-ui]";

function inspectable(target: EventTarget | null): Element | null {
  if (!(target instanceof Element) || target.closest(UI)) return null;
  return target.closest(INSPECT);
}

/**
 * Hover previews a component, click (or tap) selects it, and N / P step
 * through every inspectable component for keyboard users. While active, page
 * clicks are captured so links don't navigate away mid-game.
 */
export function useInspector() {
  const [hovered, setHovered] = useState<Element | null>(null);
  const [selected, setSelected] = useState<Element | null>(null);

  useEffect(() => {
    const onMove = (event: PointerEvent) => setHovered(inspectable(event.target));
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(UI)) return;
      event.preventDefault();
      event.stopPropagation();
      setSelected(inspectable(event.target));
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  const step = useCallback((direction: 1 | -1) => {
    const all = [...document.querySelectorAll(INSPECT)].filter((el) => !el.closest(UI));
    setSelected((current) => {
      const index = current ? all.indexOf(current) : -1;
      const next = all[(index + direction + all.length) % all.length] ?? null;
      next?.scrollIntoView({ block: "center", behavior: "smooth" });
      return next;
    });
  }, []);

  return { hovered, selected, setSelected, step };
}
