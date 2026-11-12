"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { bugs, nudge } from "@/lib/qa/bugs";
import { describe, readTokens } from "@/lib/qa/inspect";
import { useMotion } from "@/lib/motion";
import { FixPanel } from "./FixPanel";
import { PullRequestDialog } from "./PullRequestDialog";
import { QaHud } from "./QaHud";
import { useInspector } from "./useInspector";
import { useQaGame } from "./useQaGame";
import { XrayOverlay } from "./XrayOverlay";

export const BEST_KEY = "qa-best-ms";

type QaModeProps = {
  cv: { href: string; size: string } | null;
  onExit: () => void;
  onReplay: () => void;
};

/** "Find the 5 bugs": an inspector over the live page, plus the game around it. */
export default function QaMode({ cv, onExit, onReplay }: QaModeProps) {
  const game = useQaGame();
  const { hovered, selected, step } = useInspector();
  const { paused, togglePaused } = useMotion();
  const pausedOnEntry = useRef(paused);
  const [message, setMessage] = useState("Five things on this page break the spec. Find them.");
  const [best, setBest] = useState<{ isBest: boolean } | null>(null);
  const { fixing, values, setValue, closeFix } = game;

  // Hold all motion still while inspecting; restore on exit. Crosshair cursor via CSS.
  useEffect(() => {
    const wasPaused = pausedOnEntry.current;
    if (!wasPaused) togglePaused();
    document.documentElement.dataset.qa = "on";
    return () => {
      delete document.documentElement.dataset.qa;
      if (!wasPaused) togglePaused();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once per session
  }, []);

  useEffect(() => {
    if (game.finishedIn === null) return;
    let previous = Infinity;
    try {
      previous = Number(localStorage.getItem(BEST_KEY) ?? Infinity);
      if (game.finishedIn < previous)
        localStorage.setItem(BEST_KEY, String(Math.round(game.finishedIn)));
    } catch {
      // No storage: the score just isn't remembered.
    }
    setBest({ isBest: game.finishedIn < previous });
  }, [game.finishedIn]);

  // A fixed bug closes its panel after a beat.
  useEffect(() => {
    if (!fixing || values[fixing.id] !== fixing.correct) return;
    const timer = setTimeout(closeFix, 900);
    return () => clearTimeout(timer);
  }, [fixing, values, closeFix]);

  const flag = useCallback(() => {
    if (!selected) return;
    const bug = game.flag(selected);
    setMessage(
      bug
        ? `Bug found: ${bug.label.toLowerCase()}. Now fix it.`
        : "That one matches the spec. Keep looking.",
    );
  }, [selected, game]);

  const hint = useCallback(() => {
    const el = game.hint();
    const bug = bugs.find((b) => !game.found.includes(b.id));
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    if (bug) setMessage(`Hint: something in view breaks “${bug.spec}”`);
  }, [game]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest("dialog")) return;
      if (event.key === "Escape") return onExit();
      if (fixing?.kind === "number" && event.key.startsWith("Arrow")) {
        event.preventDefault();
        const up = event.key === "ArrowRight" || event.key === "ArrowUp";
        return setValue(fixing, nudge(fixing, values[fixing.id] ?? fixing.wrong, up ? 1 : -1));
      }
      if (fixing) return;
      if (event.key === "n" || event.key === "N") step(1);
      if (event.key === "p" || event.key === "P") step(-1);
      if (event.key === "Enter" && !(event.target instanceof HTMLButtonElement)) flag();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fixing, values, setValue, step, flag, onExit]);

  const specs = selected ? describe(selected, readTokens()) : [];

  return createPortal(
    <>
      {hovered && hovered !== selected ? <XrayOverlay el={hovered} /> : null}
      {selected ? <XrayOverlay el={selected} selected /> : null}
      <QaHud
        startedAt={game.startedAt.current}
        fixedCount={game.fixed.length}
        selectedName={selected?.getAttribute("data-inspect") ?? null}
        specs={specs}
        message={message}
        onFlag={flag}
        onHint={hint}
        onExit={onExit}
      >
        {fixing ? (
          <FixPanel
            bug={fixing}
            value={values[fixing.id] ?? fixing.wrong}
            onChange={(v) => setValue(fixing, v)}
          />
        ) : undefined}
      </QaHud>
      {game.finishedIn !== null && best ? (
        <PullRequestDialog
          elapsed={game.finishedIn}
          misses={game.misses}
          hints={game.hints}
          isBest={best.isBest}
          cv={cv}
          onReplay={onReplay}
          onClose={onExit}
        />
      ) : null}
    </>,
    document.body,
  );
}
