import { ImageResponse } from "next/og";
import { readFontsource } from "@/lib/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
        fontSize: 120,
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
