"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { BugIcon } from "@/components/ui/icons";
import type { Cv } from "@/lib/cv";
import { useMotion } from "@/lib/motion";
import { readBest } from "@/lib/qa/best";
import { formatTime } from "@/lib/qa/bugs";

// Each game is its own chunk, fetched only when someone starts it.
const QaMode = dynamic(() => import("@/components/qa/QaMode"), { ssr: false });
const BreakMode = dynamic(() => import("@/components/break/BreakMode"), { ssr: false });

type Game = { name: "qa" | "break"; run: number } | null;
type PlayCardProps = { index: number; cv: Cv | null };

const button =
  // No display utility here: each button sets its own, so `hidden` can win on phones.
  "h-10 items-center gap-2 rounded-full px-5 text-sm font-medium transition-opacity hover:opacity-90";

/** Bento entry point for the site's two games, in the slot the spec gave "How I work". */
export function PlayCard({ index, cv }: PlayCardProps) {
  const { reduced } = useMotion();
  const [game, setGame] = useState<Game>(null);
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => setBest(readBest()), [game]);

  const start = (name: "qa" | "break") => setGame((g) => ({ name, run: (g?.run ?? 0) + 1 }));
  const exit = () => setGame(null);

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
          onClick={() => start("qa")}
          className={`${button} inline-flex bg-segment text-segment-fg`}
        >
          <BugIcon className="size-3.5" /> Start QA mode
        </button>
        {reduced ? null : (
          <button
            type="button"
            onClick={() => start("break")}
            className={`${button} hidden border border-border hover:bg-chip md:inline-flex`}
          >
            Don’t press this
          </button>
        )}
        {best ? <p className="text-sm text-muted">Your best: {formatTime(best)}</p> : null}
      </div>
      {game?.name === "qa" ? (
        <QaMode key={game.run} cv={cv} onExit={exit} onReplay={() => start("qa")} />
      ) : null}
      {game?.name === "break" ? (
        <BreakMode key={game.run} onExit={exit} onAgain={() => start("break")} />
      ) : null}
    </BentoCard>
  );
}
