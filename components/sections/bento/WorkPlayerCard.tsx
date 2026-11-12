"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { GridIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon } from "@/components/ui/icons";
import { useClock } from "@/lib/motion";

type WorkSlide = {
  slug: string;
  title: string;
  role: string;
  cover: { src: string; alt: string };
};

const SLIDE_MS = 6000;
const pad = (n: number) => String(n).padStart(2, "0");

/** "What I'm listening" reworked as a player that cycles through the case studies. */
export function WorkPlayerCard({ slides, index: order }: { slides: WorkSlide[]; index: number }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const elapsed = useRef(0);
  const barRef = useRef<HTMLSpanElement>(null);
  const slide = slides[index] ?? slides[0];

  const go = (next: number) => {
    elapsed.current = 0;
    setIndex((next + slides.length) % slides.length);
  };

  useClock((_, delta) => {
    if (!playing) return;
    elapsed.current += delta;
    if (barRef.current)
      barRef.current.style.transform = `scaleX(${Math.min(elapsed.current / SLIDE_MS, 1)})`;
    if (elapsed.current >= SLIDE_MS) go(index + 1);
  });

  if (!slide) return null;
  const href = `/work/${slide.slug}`;
  const control = "grid size-9 place-items-center rounded-full transition-colors hover:bg-chip";

  return (
    <BentoCard label="Selected work" icon={GridIcon} area="work" index={order}>
      <div className="mt-3.5 flex min-h-0 flex-1 gap-4 sm:gap-6">
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="relative aspect-[165/173] w-[38%] max-w-[165px] shrink-0 self-start overflow-hidden rounded-[9px] bg-chip"
        >
          <Image
            key={slide.slug}
            src={slide.cover.src}
            alt=""
            fill
            sizes="165px"
            className="object-cover motion-safe:animate-step-in"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-[13px] text-muted tabular-nums">
            {pad(index + 1)} / {pad(slides.length)}
          </p>
          <h3
            key={slide.slug}
            className="mt-1.5 text-[18px] font-medium tracking-wide uppercase motion-safe:animate-step-in"
          >
            <Link href={href} className="hover:text-accent-ink">
              {slide.title}
              <span className="sr-only">: case study</span>
            </Link>
          </h3>
          <p className="text-[15px] text-muted">{slide.role}</p>

          <div className="mt-auto pt-4">
            <span
              aria-hidden="true"
              className="block h-[3.5px] w-full max-w-[243px] overflow-hidden rounded-full bg-chip"
            >
              <span
                ref={barRef}
                className="block h-full origin-left scale-x-0 rounded-full bg-fg"
              />
            </span>
            <div className="mt-3 flex items-center gap-1">
              <button type="button" onClick={() => go(index - 1)} className={control}>
                <PrevIcon className="size-3.5" />
                <span className="sr-only">Previous project</span>
              </button>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                aria-pressed={!playing}
                className={`${control} bg-fg text-bg hover:bg-fg/85`}
              >
                {playing ? <PauseIcon className="size-3.5" /> : <PlayIcon className="size-3.5" />}
                <span className="sr-only">Pause project rotation</span>
              </button>
              <button type="button" onClick={() => go(index + 1)} className={control}>
                <NextIcon className="size-3.5" />
                <span className="sr-only">Next project</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </BentoCard>
  );
}
