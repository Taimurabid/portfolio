import { BentoCard } from "@/components/ui/BentoCard";
import { PenIcon } from "@/components/ui/icons";
import { Tag } from "@/components/ui/Tag";
import { disciplines } from "@/lib/content";

/** The spec's "What I'm reading" slot: both disciplines, with a tilted artboard. */
export function WhatIDoCard({ index }: { index: number }) {
  return (
    <BentoCard
      label="What I do"
      icon={PenIcon}
      area="do"
      qa="do-card"
      index={index}
      className="min-h-[258px]"
    >
      <h3 className="mt-4 text-[25.5px] leading-[35px] tracking-[-0.02em]">
        Design &amp; Engineering
      </h3>
      <dl className="relative z-10 mt-4 space-y-3">
        {disciplines.map((discipline) => (
          <div key={discipline.title}>
            <dt className="text-[13px] text-muted">{discipline.title}</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {discipline.highlights.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      {/* Decorative artboard, tilted 5° and bleeding off the bottom edge like the spec's book. */}
      <div
        aria-hidden="true"
        className="absolute -right-3 -bottom-10 h-36 w-28 rotate-[5deg] rounded-lg border border-border bg-bg p-3 shadow-card-lift transition-transform duration-500 group-hover:rotate-[8deg]"
      >
        <span className="block size-3 rounded-full bg-accent" />
        <span className="mt-3 block h-1.5 w-16 rounded-full bg-fg/70" />
        <span className="mt-2 block h-1.5 w-12 rounded-full bg-fg/25" />
        <span className="mt-2 block h-1.5 w-14 rounded-full bg-fg/25" />
        <span className="mt-4 block h-6 w-full rounded bg-chip" />
      </div>
    </BentoCard>
  );
}
