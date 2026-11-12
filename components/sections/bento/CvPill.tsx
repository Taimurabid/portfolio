import { DownloadIcon } from "@/components/ui/icons";
import type { Cv } from "@/lib/cv";

/** Third intro pill. Only rendered when the CV PDF exists (see lib/cv.ts). */
export function CvPill({ cv }: { cv: Cv }) {
  return (
    <a
      href={cv.href}
      download
      data-inspect="CvPill"
      className="group inline-flex h-[53px] items-center gap-3 rounded-full border border-border bg-surface px-5 text-[15px] whitespace-nowrap shadow-card transition-colors hover:text-accent-ink"
    >
      <DownloadIcon className="size-4 transition-transform group-hover:translate-y-0.5" />
      Download CV
      <span className="text-sm text-muted">PDF · {cv.size}</span>
    </a>
  );
}
