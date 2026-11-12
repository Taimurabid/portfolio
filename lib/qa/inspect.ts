/**
 * Measurements for the X-ray overlay: what a designer would check in Figma's
 * inspect panel, read from the live element's computed style.
 */
export type Spec = { label: string; value: string };

const TOKENS = [
  "page",
  "card",
  "chip",
  "fg",
  "muted",
  "faint",
  "accent",
  "accent-ink",
  "ok",
  "segment",
];

/** "rgb(222, 99, 29)" or "#DE631D" → "#de631d"; null for transparent or unparseable. */
export function toHex(color: string): string | null {
  const value = color.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(value)) return value;
  const match = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!match) return null;
  if (match[4] !== undefined && Number(match[4]) === 0) return null;
  return `#${[match[1], match[2], match[3]].map((n) => Number(n).toString(16).padStart(2, "0")).join("")}`;
}

/** Name of the design token whose value matches `hex`, if any. */
export function tokenFor(hex: string, tokens: Record<string, string>): string | null {
  const hit = Object.entries(tokens).find(([, value]) => toHex(value) === hex);
  return hit ? `--${hit[0]}` : null;
}

export function readTokens(): Record<string, string> {
  const styles = getComputedStyle(document.documentElement);
  return Object.fromEntries(TOKENS.map((name) => [name, styles.getPropertyValue(`--${name}`)]));
}

const px = (value: string) => Math.round(parseFloat(value) || 0);

/** "20px 20px 20px 20px" → "20"; mixed sides keep all four. */
function sides(cs: CSSStyleDeclaration, prop: "padding"): string | null {
  const values = ["top", "right", "bottom", "left"].map((s) =>
    px(cs.getPropertyValue(`${prop}-${s}`)),
  );
  if (values.every((v) => v === 0)) return null;
  return new Set(values).size === 1 ? `${values[0]}` : values.join(" · ");
}

export function describe(el: Element, tokens: Record<string, string>): Spec[] {
  const cs = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const specs: Spec[] = [
    { label: "Size", value: `${Math.round(rect.width)} × ${Math.round(rect.height)}` },
  ];

  const padding = sides(cs, "padding");
  if (padding) specs.push({ label: "Padding", value: padding });
  if (px(cs.borderTopLeftRadius))
    specs.push({ label: "Radius", value: `${px(cs.borderTopLeftRadius)}px` });
  if (/grid|flex/.test(cs.display) && px(cs.rowGap))
    specs.push({ label: "Gap", value: `${px(cs.rowGap)}px` });
  if (cs.position === "relative" && px(cs.left))
    specs.push({ label: "Offset", value: `${px(cs.left)}px` });
  if (el.textContent?.trim() && !el.querySelector("section, img")) {
    specs.push({ label: "Font", value: `${px(cs.fontSize)}px · ${cs.fontWeight}` });
  }
  const bg = toHex(cs.backgroundColor);
  if (bg) specs.push({ label: "Fill", value: tokenFor(bg, tokens) ?? bg });
  return specs;
}
