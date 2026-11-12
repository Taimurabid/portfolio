import type { Rect } from "./infer";

/** Ready-made sketches on the 480×360 canvas, so anyone can try it without drawing. */
export const CANVAS = { width: 480, height: 360 } as const;

const r = (id: string, x: number, y: number, w: number, h: number): Rect => ({ id, x, y, w, h });

export const examples: { name: string; rects: Rect[] }[] = [
  {
    name: "Profile card",
    rects: [
      r("card", 40, 40, 400, 280),
      r("avatar", 64, 64, 56, 56),
      r("name", 136, 72, 200, 40),
      r("bio-1", 64, 144, 352, 16),
      r("bio-2", 64, 168, 256, 16),
      r("follow", 64, 248, 120, 48),
    ],
  },
  {
    name: "Media card",
    rects: [
      r("card", 40, 24, 400, 312),
      r("image", 56, 40, 368, 152),
      r("title", 56, 208, 240, 32),
      r("body", 56, 248, 320, 16),
      r("primary", 56, 280, 104, 40),
      r("secondary", 176, 280, 104, 40),
    ],
  },
  {
    name: "Stats row",
    rects: [
      r("a", 24, 112, 136, 120),
      r("a-label", 40, 128, 80, 16),
      r("a-value", 40, 160, 112, 28),
      r("b", 172, 112, 136, 120),
      r("b-label", 188, 128, 80, 16),
      r("b-value", 188, 160, 112, 28),
      r("c", 320, 112, 136, 120),
      r("c-label", 336, 128, 80, 16),
      r("c-value", 336, 160, 112, 28),
    ],
  },
];
