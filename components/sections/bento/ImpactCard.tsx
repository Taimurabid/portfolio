import Image from "next/image";
import Link from "next/link";
import { BentoCard } from "@/components/ui/BentoCard";
import { StepsIcon } from "@/components/ui/icons";
import { impact } from "@/lib/content";

/** The spec's photo slot: a measured result over that project's cover. */
export function ImpactCard({ index }: { index: number }) {
  const href = `/work/${impact.slug}`;

  return (
    <BentoCard
      label="Impact"
      icon={StepsIcon}
      area="impact"
      index={index}
      bleed
      className="min-h-[242px]"
    >
      <div className="absolute inset-[11px] overflow-hidden rounded-[9px] bg-chip">
        <Image
          src={`/work/${impact.slug}/cover.jpg`}
          alt=""
          fill
          sizes="(min-width: 1100px) 330px, (min-width: 821px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      {/* Mouse users can click anywhere; keyboard and screen readers get the one pill link. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0" />
      <Link
        href={href}
        className="absolute right-5 bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13.5px] leading-snug text-[#1e1c1a] shadow-card sm:right-auto"
      >
        <span aria-hidden="true" className="size-2.5 shrink-0 rounded-full bg-[#de631d]" />
        {impact.claim}
      </Link>
    </BentoCard>
  );
}
