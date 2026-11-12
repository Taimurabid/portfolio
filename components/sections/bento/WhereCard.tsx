import { BentoCard } from "@/components/ui/BentoCard";
import { GlobeIcon } from "@/components/ui/icons";
import { availability } from "@/lib/content";

/** The spec's map slot: a dotted "map" with where and when Taimur works. */
export function WhereCard({ index }: { index: number }) {
  return (
    <BentoCard
      label="Where I work"
      icon={GlobeIcon}
      area="where"
      index={index}
      bleed
      className="min-h-[242px]"
    >
      <div className="absolute inset-[11px] overflow-hidden rounded-[9px] bg-chip/60 [background-image:radial-gradient(var(--color-faint)_1px,transparent_1.3px)] [background-size:14px_14px]">
        <div className="absolute inset-0 bg-[radial-gradient(closest-side,var(--color-surface)_35%,transparent)] opacity-90" />
      </div>
      <p className="relative m-auto text-[27px] tracking-[-0.02em] text-faint">Remote</p>
      <p className="absolute bottom-5 left-5 inline-flex h-8 items-center rounded-full bg-surface px-3 text-[13px] shadow-card">
        <span className="sr-only">{availability} </span>
        <span aria-hidden="true">US hours</span>
      </p>
    </BentoCard>
  );
}
