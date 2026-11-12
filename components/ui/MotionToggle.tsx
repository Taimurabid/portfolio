"use client";

import { useMotion } from "@/lib/motion";
import { PauseIcon, PlayIcon } from "./icons";

/** Pauses every animation on the page (WCAG 2.2.2). Hidden when motion is reduced. */
export function MotionToggle() {
  const { paused, togglePaused, reduced } = useMotion();
  if (reduced) return null;

  return (
    <button
      type="button"
      onClick={togglePaused}
      aria-pressed={paused}
      className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-fg transition-colors hover:bg-surface"
    >
      <span className="sr-only">Pause animations</span>
      {paused ? <PlayIcon className="size-3.5" /> : <PauseIcon className="size-3.5" />}
    </button>
  );
}
