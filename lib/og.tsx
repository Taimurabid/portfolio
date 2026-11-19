import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "./site";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Light-theme tokens from app/globals.css (OG images always use the light theme).
const colors = { bg: "#eeece8", fg: "#1e1c1a", muted: "#6b6762", accent: "#de631d" };

/** Satori can't read woff2, so Fontsource's .woff files are read from disk at build time. */
export function readFontsource(pkg: "inter", name: string) {
  return readFile(path.join(process.cwd(), "node_modules", "@fontsource", pkg, "files", name));
}

async function loadFonts() {
  const [semibold, medium, regular] = await Promise.all([
    readFontsource("inter", "inter-latin-600-normal.woff"),
    readFontsource("inter", "inter-latin-500-normal.woff"),
    readFontsource("inter", "inter-latin-400-normal.woff"),
  ]);

  return [
    { name: "Inter", data: semibold, weight: 600 as const, style: "normal" as const },
    { name: "Inter", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
  ];
}

type OgImageProps = {
  eyebrow: string;
  title: string;
  /** Rendered in the accent color. */
  subtitle?: string;
  description?: string;
};

/** Shared 1200×630 Open Graph card for every page. */
export async function renderOgImage({ eyebrow, title, subtitle, description }: OgImageProps) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px 88px",
        background: colors.bg,
        color: colors.fg,
        fontFamily: "Inter",
        fontWeight: 400,
        borderBottom: `16px solid ${colors.accent}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26 }}>
        <span style={{ fontWeight: 600 }}>{site.name}</span>
        <span style={{ color: colors.accent, letterSpacing: 4, textTransform: "uppercase" }}>
          {eyebrow}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontWeight: 600, fontSize: 112, lineHeight: 1, letterSpacing: -4.5 }}>
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              marginTop: 24,
              fontWeight: 500,
              fontSize: 40,
              letterSpacing: -0.8,
              color: colors.accent,
            }}
          >
            {subtitle}
          </div>
        ) : null}
        {description ? (
          <div
            style={{
              marginTop: 28,
              maxWidth: 920,
              fontSize: 32,
              lineHeight: 1.4,
              color: colors.muted,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>
    </div>,
    { ...ogSize, fonts: await loadFonts() },
  );
}
