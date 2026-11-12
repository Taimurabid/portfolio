"use client";

import { formatTime } from "@/lib/qa/bugs";

type BreakHudProps = {
  placed: number;
  total: number;
  elapsed: number;
  result: { ms: number; avg: number } | null;
  onRestore: () => void;
  onAgain: () => void;
  onExit: () => void;
};

const action = "inline-flex h-9 items-center rounded-full px-3.5 text-sm transition-colors";

/** Status bar for Break mode, pinned to the top so it never covers the pile. */
export function BreakHud({
  placed,
  total,
  elapsed,
  result,
  onRestore,
  onAgain,
  onExit,
}: BreakHudProps) {
  return (
    <section
      aria-label="Break the site"
      className="fixed inset-x-3 top-20 z-[70] mx-auto flex max-w-[620px] card flex-wrap items-center gap-x-4 gap-y-2 p-3 pl-4"
    >
      {result ? (
        <>
          <p role="status" className="text-sm">
            <span className="font-semibold">Rebuilt in {formatTime(result.ms)}</span>
            <span className="text-muted">
              {" "}
              · {result.avg}px off on average{result.avg <= 4 ? " · pixel perfect" : ""}
            </span>
          </p>
          <div className="ml-auto flex gap-1">
            <button type="button" onClick={onAgain} className={`${action} hover:bg-chip`}>
              Break it again
            </button>
            <button
              type="button"
              onClick={onExit}
              className={`${action} bg-segment text-segment-fg`}
            >
              Done
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold">You broke it.</p>
          <p role="status" className="text-sm text-muted">
            Drag the cards back home: {placed}/{total} · {formatTime(elapsed)}
          </p>
          <div className="ml-auto flex gap-1">
            <button type="button" onClick={onRestore} className={`${action} hover:bg-chip`}>
              Put it back for me
            </button>
            <button type="button" onClick={onExit} className={`${action} hover:bg-chip`}>
              Exit <kbd className="ml-1 hidden text-xs text-muted sm:inline">Esc</kbd>
            </button>
          </div>
        </>
      )}
    </section>
  );
}
