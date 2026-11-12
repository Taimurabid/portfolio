/** "What I designed/built" → "what-i-designed-built" */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** "2023-10", null → "2023 – now"; "2019", "2019" → "2019". */
export function formatYears(start: string, end: string | null): string {
  const from = start.slice(0, 4);
  if (end === null) return `${from} – now`;
  const to = end.slice(0, 4);
  return from === to ? from : `${from} – ${to}`;
}
