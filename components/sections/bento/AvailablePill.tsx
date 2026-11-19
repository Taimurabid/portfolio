/** Green status dot with a pulsing halo, shown as a badge above the headline. */
export function AvailablePill() {
  return (
    <p
      data-inspect="AvailablePill"
      className="inline-flex h-9 items-center gap-2.5 rounded-full border border-border bg-surface px-4 text-sm whitespace-nowrap shadow-card"
    >
      <span aria-hidden="true" className="relative size-2.5">
        <span className="absolute inset-0 rounded-full bg-ok motion-safe:animate-halo" />
        <span className="absolute inset-0 rounded-full bg-ok" />
      </span>
      Available for work · US hours
    </p>
  );
}
