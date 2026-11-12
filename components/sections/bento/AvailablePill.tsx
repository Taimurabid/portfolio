/** Green status dot with a pulsing halo. */
export function AvailablePill() {
  return (
    <p
      data-inspect="AvailablePill"
      className="inline-flex h-[53px] items-center gap-3 rounded-full border border-border bg-surface px-5 text-[15px] whitespace-nowrap shadow-card"
    >
      <span aria-hidden="true" className="relative size-2.5">
        <span className="absolute inset-0 rounded-full bg-ok motion-safe:animate-halo" />
        <span className="absolute inset-0 rounded-full bg-ok" />
      </span>
      Available for work
    </p>
  );
}
