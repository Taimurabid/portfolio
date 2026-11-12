"use client";

import { useEffect, useRef } from "react";
import { bugs, diffLines, formatTime } from "@/lib/qa/bugs";
import { site } from "@/lib/site";

type PullRequestDialogProps = {
  elapsed: number;
  misses: number;
  hints: number;
  isBest: boolean;
  cv: { href: string; size: string } | null;
  onReplay: () => void;
  onClose: () => void;
};

const button =
  "inline-flex h-10 items-center rounded-full px-4 text-sm font-medium transition-opacity hover:opacity-85";

/** The finale: the player's fixes, written up as a pull request. */
export function PullRequestDialog({
  elapsed,
  misses,
  hints,
  isBest,
  cv,
  onReplay,
  onClose,
}: PullRequestDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    ref.current?.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      data-qa-ui
      aria-labelledby="pr-title"
      onClose={onClose}
      className="m-auto w-[min(640px,calc(100vw-24px))] card p-0 text-fg backdrop:bg-black/40 backdrop:backdrop-blur-sm"
    >
      <div className="p-5 sm:p-7">
        <p className="inline-flex items-center gap-2 rounded-full bg-[#1a7f35] px-2.5 py-1 text-xs font-medium text-white">
          ● Ready to merge
        </p>
        <h2 id="pr-title" className="mt-3 text-h3">
          fix: {bugs.length} visual regressions
        </h2>
        <p className="mt-1 text-sm text-muted">
          You · {formatTime(elapsed)}
          {isBest ? " · new best" : ""} · {misses} false {misses === 1 ? "alarm" : "alarms"} ·{" "}
          {hints} {hints === 1 ? "hint" : "hints"}
        </p>

        <div className="mt-5 max-h-[38vh] overflow-auto rounded-xl border border-border font-mono text-[12.5px] leading-relaxed">
          {bugs.map((bug) => {
            const [minus, plus] = diffLines(bug);
            return (
              <div key={bug.id} className="border-b border-border last:border-b-0">
                <p className="bg-chip/60 px-3 py-1.5 text-muted">components/…/{bug.file}</p>
                <p className="bg-[#d73a49]/10 px-3 py-0.5">{minus}</p>
                <p className="bg-[#1f8a3b]/12 px-3 py-0.5">{plus}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-5 text-sm">
          That eye for detail is the job: I design these specs in Figma and hold them in code.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={`mailto:${site.email}`} className={`${button} bg-accent text-accent-fg`}>
            Hire the person who builds like this
          </a>
          {cv ? (
            <a href={cv.href} download className={`${button} bg-chip`}>
              Download CV
            </a>
          ) : null}
          <button type="button" onClick={onReplay} className={`${button} bg-chip`}>
            Play again
          </button>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            className={`${button} hover:bg-chip`}
          >
            Merge &amp; close
          </button>
        </div>
      </div>
    </dialog>
  );
}
