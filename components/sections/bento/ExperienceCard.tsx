"use client";

import { useEffect, useRef, useState } from "react";
import { BentoCard } from "@/components/ui/BentoCard";
import { BriefcaseIcon } from "@/components/ui/icons";
import type { ExperienceItem } from "@/lib/content";
import { formatYears } from "@/lib/format";
import { useClock, useMotion } from "@/lib/motion";

const SPEED = 9; // px per second, from the spec

function Timeline({ items, hidden = false }: { items: ExperienceItem[]; hidden?: boolean }) {
  return (
    <ol aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item.org} className="relative pb-5 pl-6">
          <span
            aria-hidden="true"
            className="absolute top-[7px] left-0 size-[8.5px] rounded-full bg-fg"
          />
          <p className="text-[15.5px] leading-snug">
            {item.org} — {item.role}
          </p>
          <p className="mt-0.5 text-[13px] text-muted tabular-nums">
            {formatYears(item.start, item.end)}
          </p>
          <p className="mt-1 text-[13px] leading-snug text-muted">{item.summary}</p>
        </li>
      ))}
    </ol>
  );
}

/** Timeline that drifts upward in a seamless loop; hover holds it. */
export function ExperienceCard({ items, index }: { items: ExperienceItem[]; index: number }) {
  const { paused, reduced } = useMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const height = useRef(0);
  const offset = useRef(0);
  const [held, setHeld] = useState(false);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(() => (height.current = list.offsetHeight));
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  useClock((_, delta) => {
    if (held || !trackRef.current || height.current === 0) return;
    offset.current = (offset.current + (delta * SPEED) / 1000) % height.current;
    trackRef.current.style.transform = `translateY(${-offset.current}px)`;
  });

  // Paused or reduced motion: no drift, so let people scroll the list instead.
  const scrollable = paused || reduced;

  return (
    <BentoCard
      label="Experience"
      icon={BriefcaseIcon}
      area="exp"
      qa="exp-card"
      index={index}
      className="h-[258px]"
    >
      <div
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        className={`relative mt-4 min-h-0 flex-1 [mask-image:linear-gradient(transparent,#000_14%,#000_80%,transparent)] ${scrollable ? "overflow-y-auto" : "overflow-hidden"}`}
      >
        <div ref={trackRef} className="relative will-change-transform">
          <span
            aria-hidden="true"
            className="absolute top-0 bottom-0 left-[3.5px] w-[1.5px] bg-fg/80"
          />
          <div ref={listRef} className="pt-3">
            <Timeline items={items} />
          </div>
          {scrollable ? null : <Timeline items={items} hidden />}
        </div>
      </div>
    </BentoCard>
  );
}
