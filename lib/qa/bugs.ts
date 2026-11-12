/**
 * The five visual bugs QA Mode plants on the live page. Each one breaks a
 * single design-system rule on a real element (found by `data-qa`), and is
 * fixed by stepping the value back to spec. Pure data and functions only, so
 * the rules are unit-tested without a browser.
 */
export type Bug = {
  id: string;
  /** `data-qa` value of the element the bug lives on. */
  target: string;
  label: string;
  property: string;
  /** Component file the "pull request" diff points at. */
  file: string;
  /** The rule as written on the spec sheet. */
  spec: string;
  /** True when only the element itself (not a child) counts as finding it. */
  exact?: boolean;
} & (
  | {
      kind: "number";
      wrong: number;
      correct: number;
      unit: string;
      step: number;
      min: number;
      max: number;
    }
  | { kind: "color"; wrong: string; correct: string; options: string[] }
);

export type BugValue = number | string;

export const bugs: Bug[] = [
  {
    id: "offset",
    target: "exp-card",
    label: "Grid alignment",
    property: "left",
    file: "ExperienceCard.tsx",
    spec: "Cards sit exactly on the grid, with no offset.",
    kind: "number",
    wrong: 3,
    correct: 0,
    unit: "px",
    step: 1,
    min: -12,
    max: 12,
  },
  {
    id: "accent",
    target: "mail-dot",
    label: "Accent colour",
    property: "background-color",
    file: "EmailPill.tsx",
    spec: "There is one accent colour: --accent.",
    kind: "color",
    wrong: "#e4572e",
    correct: "var(--accent)",
    options: ["#e4572e", "var(--accent)", "#f2994a"],
  },
  {
    id: "radius",
    target: "do-card",
    label: "Corner radius",
    property: "border-radius",
    file: "WhatIDoCard.tsx",
    spec: "Every card has a 14px corner radius.",
    kind: "number",
    wrong: 20,
    correct: 14,
    unit: "px",
    step: 1,
    min: 0,
    max: 32,
  },
  {
    id: "weight",
    target: "headline",
    label: "Font weight",
    property: "font-weight",
    file: "Intro.tsx",
    spec: "Headlines use Inter at weight 520.",
    kind: "number",
    wrong: 640,
    correct: 520,
    unit: "",
    step: 40,
    min: 400,
    max: 800,
  },
  {
    id: "gap",
    target: "bento-grid",
    label: "Grid gap",
    property: "gap",
    file: "Bento.tsx",
    spec: "The bento gap is 17px.",
    exact: true,
    kind: "number",
    wrong: 13,
    correct: 17,
    unit: "px",
    step: 1,
    min: 8,
    max: 32,
  },
];

export function cssValue(bug: Bug, value: BugValue): string {
  return bug.kind === "number" ? `${value}${bug.unit}` : String(value);
}

export function isFixed(bug: Bug, value: BugValue): boolean {
  return value === bug.correct;
}

/** Steps a numeric bug one notch, clamped to its range. Colours are picked, not stepped. */
export function nudge(bug: Bug, value: BugValue, direction: 1 | -1): BugValue {
  if (bug.kind !== "number" || typeof value !== "number") return value;
  return Math.min(bug.max, Math.max(bug.min, value + direction * bug.step));
}

/** The before/after lines shown in the finale's pull-request diff. */
export function diffLines(bug: Bug): [string, string] {
  return [
    `- ${bug.property}: ${cssValue(bug, bug.wrong)};`,
    `+ ${bug.property}: ${cssValue(bug, bug.correct)};`,
  ];
}

/** 102_000 → "1:42" */
export function formatTime(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
