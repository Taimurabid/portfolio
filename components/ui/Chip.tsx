import type { ComponentType, ReactNode, SVGProps } from "react";

type ChipProps = {
  /** Render as a heading when the chip names its card. */
  as?: "span" | "h2";
  id?: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  children: ReactNode;
  className?: string;
};

/** Small rounded label: line icon plus text, as at the top-left of every card. */
export function Chip({ as: Tag = "span", id, icon: Icon, children, className = "" }: ChipProps) {
  return (
    <Tag
      id={id}
      className={`inline-flex h-7 items-center gap-1.5 rounded-full bg-chip px-2.5 font-medium text-chip text-muted ${className}`}
    >
      {Icon ? <Icon className="size-3.5" /> : null}
      {children}
    </Tag>
  );
}
