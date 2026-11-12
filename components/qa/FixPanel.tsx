"use client";

import { cssValue, isFixed, nudge, type Bug, type BugValue } from "@/lib/qa/bugs";

type FixPanelProps = { bug: Bug; value: BugValue; onChange: (value: BugValue) => void };

const stepper =
  "grid size-9 place-items-center rounded-full bg-chip text-lg transition-colors hover:bg-fg hover:text-bg";

/** Controls for nudging one bug back to spec. Arrow keys work too (handled by QaMode). */
export function FixPanel({ bug, value, onChange }: FixPanelProps) {
  const done = isFixed(bug, value);

  return (
    <div className="mt-3 rounded-xl bg-chip/60 p-3">
      <p className="text-sm">
        <span className="font-medium">Bug found: {bug.label.toLowerCase()}.</span>{" "}
        <span className="text-muted">Spec: {bug.spec}</span>
      </p>
      {bug.kind === "number" ? (
        <div className="mt-3 flex items-center gap-3">
          <button type="button" className={stepper} onClick={() => onChange(nudge(bug, value, -1))}>
            <span aria-hidden="true">−</span>
            <span className="sr-only">Decrease {bug.label}</span>
          </button>
          <output className="min-w-20 text-center font-mono text-sm tabular-nums">
            {bug.property}: {cssValue(bug, value)}
          </output>
          <button type="button" className={stepper} onClick={() => onChange(nudge(bug, value, 1))}>
            <span aria-hidden="true">+</span>
            <span className="sr-only">Increase {bug.label}</span>
          </button>
        </div>
      ) : (
        <div role="radiogroup" aria-label={bug.label} className="mt-3 flex gap-2">
          {bug.options.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={value === option}
              onClick={() => onChange(option)}
              className={`size-9 rounded-full outline-offset-2 ${value === option ? "outline-2 outline-fg outline-solid" : ""}`}
              style={{ background: option }}
            >
              <span className="sr-only">
                {option === "var(--accent)" ? "The accent token" : option}
              </span>
            </button>
          ))}
        </div>
      )}
      <p role="status" className={`mt-2 text-sm ${done ? "font-medium text-fg" : "text-muted"}`}>
        {done ? "Fixed. Pixel perfect ✓" : "Use the controls or the arrow keys."}
      </p>
    </div>
  );
}
