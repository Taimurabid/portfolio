"use client";

import { useEffect, useState, type ReactNode } from "react";
import { bugs, formatTime } from "@/lib/qa/bugs";
import type { Spec } from "@/lib/qa/inspect";

type QaHudProps = {
  startedAt: number;
  fixedCount: number;
  selectedName: string | null;
  specs: Spec[];
  message: string;
  onFlag: () => void;
  onHint: () => void;
  onExit: () => void;
  children?: ReactNode;
};

const action =
  "inline-flex h-9 items-center rounded-full px-3.5 text-sm transition-colors disabled:opacity-40";

/** Bottom panel: progress, timer, the selected component's specs and the actions. */
export function QaHud(props: QaHudProps) {
  const { startedAt, fixedCount, selectedName, specs, message, onFlag, onHint, onExit, children } =
    props;
  const [now, setNow] = useState(() => performance.now());
  const [showSpec, setShowSpec] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setNow(performance.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      data-qa-ui
      aria-label="QA mode"
      className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-[640px] card p-4 sm:bottom-5"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm font-semibold">QA mode</p>
        <p
          className="flex items-center gap-1"
          aria-label={`${fixedCount} of ${bugs.length} bugs fixed`}
        >
          {bugs.map((bug, i) => (
            <span
              key={bug.id}
              className={`size-2 rounded-full ${i < fixedCount ? "bg-accent" : "bg-chip"}`}
            />
          ))}
        </p>
        <p className="font-mono text-sm text-muted tabular-nums">{formatTime(now - startedAt)}</p>
        <div className="ml-auto flex gap-1">
          <button
            type="button"
            className={`${action} hover:bg-chip`}
            onClick={() => setShowSpec((s) => !s)}
            aria-expanded={showSpec}
          >
            Spec sheet
          </button>
          <button type="button" className={`${action} hover:bg-chip`} onClick={onHint}>
            Hint
          </button>
          <button type="button" className={`${action} hover:bg-chip`} onClick={onExit}>
            Exit <kbd className="ml-1 hidden text-xs text-muted sm:inline">Esc</kbd>
          </button>
        </div>
      </div>

      {showSpec ? (
        <ul className="mt-3 space-y-1 rounded-xl bg-chip/60 p-3 text-sm">
          {bugs.map((bug) => (
            <li key={bug.id}>{bug.spec}</li>
          ))}
        </ul>
      ) : null}

      {children ?? (
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <dl className="grid min-w-0 grid-cols-[auto_1fr] gap-x-3 font-mono text-xs">
            <dt className="text-muted">Inspecting</dt>
            <dd className="truncate">{selectedName ?? "Hover or tap anything · N / P to step"}</dd>
            {specs.map((spec) => (
              <div key={spec.label} className="contents">
                <dt className="text-muted">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
          <button
            type="button"
            onClick={onFlag}
            disabled={!selectedName}
            className={`${action} bg-segment text-segment-fg hover:opacity-90`}
          >
            Flag as bug <kbd className="ml-1.5 hidden text-xs opacity-70 sm:inline">Enter</kbd>
          </button>
        </div>
      )}

      <p role="status" aria-live="polite" className="mt-2 min-h-5 text-sm text-muted">
        {message}
      </p>
    </section>
  );
}
