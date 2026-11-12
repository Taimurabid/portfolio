"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMotion } from "@/lib/motion";
import { BreakHud } from "./BreakHud";
import { useCardPhysics } from "./useCardPhysics";

const CARDS = '[data-qa="bento-grid"] > section';

type BreakModeProps = { onExit: () => void; onAgain: () => void };

/** "Don't press this": the bento falls apart and the visitor rebuilds it. */
export default function BreakMode({ onExit, onAgain }: BreakModeProps) {
  const { paused, togglePaused } = useMotion();
  const pausedOnEntry = useRef(paused);
  const [startedAt] = useState(() => performance.now());
  const [now, setNow] = useState(startedAt);
  const [result, setResult] = useState<{ ms: number; avg: number } | null>(null);
  const [ready, setReady] = useState(false);

  // Bring the grid into view and freeze scrolling, so the floor is the screen's bottom.
  // Motion is resumed for the game (the visitor asked for it) and restored after.
  useEffect(() => {
    const grid = document.querySelector('[data-qa="bento-grid"]');
    if (grid)
      window.scrollTo({
        top: grid.getBoundingClientRect().top + window.scrollY - 140,
        behavior: "instant",
      });
    const root = document.documentElement;
    root.style.overflow = "hidden";
    const wasPaused = pausedOnEntry.current;
    if (wasPaused) togglePaused();
    setReady(true);
    return () => {
      root.style.removeProperty("overflow");
      if (wasPaused) togglePaused();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per session
  }, []);

  useEffect(() => {
    if (result) return;
    const timer = setInterval(() => setNow(performance.now()), 1000);
    return () => clearInterval(timer);
  }, [result]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onExit();
    const onResize = () => onExit(); // homes would be stale after a layout change
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [onExit]);

  if (!ready) return null;
  return (
    <Board
      startedAt={startedAt}
      now={now}
      result={result}
      setResult={setResult}
      onExit={onExit}
      onAgain={onAgain}
    />
  );
}

type BoardProps = BreakModeProps & {
  startedAt: number;
  now: number;
  result: { ms: number; avg: number } | null;
  setResult: (result: { ms: number; avg: number }) => void;
};

/** Mounted after the scroll position is settled, so card positions are measured correctly. */
function Board({ startedAt, now, result, setResult, onExit, onAgain }: BoardProps) {
  const physics = useCardPhysics(CARDS);
  const { placed, total, averageOffset } = physics;

  useEffect(() => {
    if (total > 0 && placed === total && !result) {
      setResult({ ms: performance.now() - startedAt, avg: averageOffset() });
    }
  }, [placed, total, result, startedAt, setResult, averageOffset]);

  const restore = () => {
    physics.restoreAll();
    setTimeout(onExit, 650);
  };

  return createPortal(
    <BreakHud
      placed={placed}
      total={total}
      elapsed={now - startedAt}
      result={result}
      onRestore={restore}
      onAgain={onAgain}
      onExit={restore}
    />,
    document.body,
  );
}
