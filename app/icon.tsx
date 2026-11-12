import { ImageResponse } from "next/og";
import { readFontsource } from "@/lib/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon: a terracotta "T" monogram. */
export default async function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#de631d",
        color: "#ffffff",
        borderRadius: 8,
        fontSize: 22,
        fontFamily: "Inter",
        fontWeight: 600,
      }}
    >
      T
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Inter",
          data: await readFontsource("inter", "inter-latin-600-normal.woff"),
          weight: 600,
        },
      ],
    },
  );
}
