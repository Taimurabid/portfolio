import {
  useId,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from "react";
import { Chip } from "./Chip";

type BentoCardProps = {
  /** Accessible name of the card region; also shown as the chip. */
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** Grid area name (see components/sections/bento/Bento.tsx). */
  area: string;
  /** Position in the entrance stagger. */
  index: number;
  /** Media fills the card (with its own inset); the chip floats on top. */
  bleed?: boolean;
  /** QA Mode bug target id (see lib/qa/bugs.ts). */
  qa?: string;
  className?: string;
  children: ReactNode;
};

/** One bento tile: a region headed by its chip (an h2) at top left. */
export function BentoCard({
  label,
  icon,
  area,
  index,
  bleed = false,
  qa,
  className = "",
  children,
}: BentoCardProps) {
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      data-inspect={`BentoCard · ${label}`}
      data-qa={qa}
      data-enter
      style={{ gridArea: area, "--i": index } as CSSProperties}
      className={`card-hover group relative flex min-w-0 card flex-col overflow-hidden ${bleed ? "" : "p-4 sm:p-5"} ${className}`}
    >
      <Chip
        as="h2"
        id={headingId}
        icon={icon}
        className={bleed ? "absolute top-4 left-4 z-10 sm:top-5 sm:left-5" : "self-start"}
      >
        {label}
      </Chip>
      {children}
    </section>
  );
}
