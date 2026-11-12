import { existsSync, statSync } from "node:fs";
import path from "node:path";

/** Drop the PDF at public/Taimur-Abid-CV.pdf and every "Download CV" link appears. */
const CV_FILE = "Taimur-Abid-CV.pdf";

export type Cv = { href: string; size: string };

/** Read at build time, so the links only exist when the file does. */
export function getCv(): Cv | null {
  const file = path.join(process.cwd(), "public", CV_FILE);
  if (!existsSync(file)) return null;
  const kb = statSync(file).size / 1024;
  return {
    href: `/${CV_FILE}`,
    size: kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${Math.round(kb)} KB`,
  };
}
