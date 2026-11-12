import Image from "next/image";
import Link from "next/link";
import { TagList } from "@/components/ui/Tag";
import type { CaseStudy } from "@/lib/work";

type WorkCardProps = {
  work: CaseStudy;
  /** Zero-based position, shown as an editorial "01", "02"… */
  index: number;
  /** Above-the-fold cards can opt into eager loading. */
  priority?: boolean;
};

/**
 * The whole card is clickable through a stretched link on the title, which keeps
 * a single, well-named link per card for screen readers. Focus is drawn on the
 * card itself.
 */
export function WorkCard({ work, index, priority = false }: WorkCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="card-hover group relative h-full card p-[11px] pb-6 outline-offset-4 outline-accent has-[a:focus-visible]:outline-2">
      <div className="relative aspect-[16/10] overflow-hidden rounded-[9px] bg-chip">
        <Image
          src={work.cover.src}
          alt={work.cover.alt}
          fill
          priority={priority}
          sizes="(min-width: 1152px) 552px, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-5 flex items-baseline justify-between gap-4 px-2">
        <div className="flex items-baseline gap-3">
          <span aria-hidden="true" className="text-sm text-accent-ink tabular-nums">
            {number}
          </span>
          <h3 className="text-h3">
            <Link
              href={`/work/${work.slug}`}
              className="after:absolute after:inset-0 focus-visible:outline-none"
            >
              {work.title}
            </Link>
          </h3>
        </div>
        <span
          aria-hidden="true"
          className="text-xl text-muted transition-[color,transform] duration-300 group-hover:translate-x-1 group-hover:text-accent"
        >
          →
        </span>
      </div>

      <p className="mt-2 px-2 text-muted">{work.summary}</p>
      <p className="mt-4 px-2 text-sm">
        <span className="sr-only">My role: </span>
        {work.role}
      </p>
      <div className="mt-3 px-2">
        <TagList tags={work.tags} label={`${work.title} tags`} />
      </div>
    </article>
  );
}
