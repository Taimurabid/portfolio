"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { BugIcon } from "@/components/ui/icons";
import type { Cv } from "@/lib/cv";
import { readBest } from "@/lib/qa/best";
import { formatTime } from "@/lib/qa/bugs";

// The whole game is a separate chunk, fetched only when someone presses Start.
const QaMode = dynamic(() => import("./QaMode"), { ssr: false });
type QaCardProps = { index: number; cv: Cv | null };

/** Bento entry point for QA Mode, in the slot the spec gave "How I work". */
export function QaCard({ index, cv }: QaCardProps) {
  const [run, setRun] = useState(0);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => setBest(readBest()), [run]);

  return (
    <BentoCard label="Play" icon={BugIcon} area="how" index={index} className="min-h-[242px]">
      <h3 className="mt-3 text-[clamp(1.5rem,1.3rem+0.6vw,1.8125rem)] leading-tight tracking-[-0.02em]">
        Think you have a designer’s eye?
      </h3>
      <p className="mt-2 max-w-[440px] text-[15px] leading-relaxed text-muted">
        I planted 5 visual bugs on this page. Inspect it like a design QA, find each one, then fix
        it to the pixel.
      </p>
      <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-segment px-5 text-sm font-medium text-segment-fg transition-opacity hover:opacity-90"
        >
          <BugIcon className="size-3.5" /> Start QA mode
        </button>
        {best ? <p className="text-sm text-muted">Your best: {formatTime(best)}</p> : null}
      </div>
      {run > 0 ? (
        <QaMode key={run} cv={cv} onExit={() => setRun(0)} onReplay={() => setRun((r) => r + 1)} />
      ) : null}
    </BentoCard>
  );
}
