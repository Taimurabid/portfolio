type SectionHeaderProps = {
  /** Two-digit index shown as an editorial marker, e.g. "01". */
  index: string;
  title: string;
  id: string;
};

/** Hairline rule, index and title. `id` labels the parent <section>. */
export function SectionHeader({ index, title, id }: SectionHeaderProps) {
  return (
    <div className="flex items-baseline gap-4 border-t border-border pt-6 sm:gap-6">
      <span aria-hidden="true" className="text-sm text-muted tabular-nums">
        {index}
      </span>
      <h2 id={id} className="text-h2">
        {title}
      </h2>
    </div>
  );
}
