import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TagList } from "@/components/ui/Tag";
import { getImageSize } from "@/lib/images";
import type { CaseStudy } from "@/lib/work";

export function CaseStudyHeader({ work }: { work: CaseStudy }) {
  const cover = getImageSize(work.cover.src);

  return (
    <header className="pt-12 sm:pt-20">
      <Container>
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
        >
          <span aria-hidden="true">←</span> All work
        </Link>

        <h1 className="mt-10 text-h1 sm:mt-14">{work.title}</h1>
        <p className="mt-6 max-w-prose text-lede text-muted">{work.summary}</p>

        <dl className="mt-10 grid gap-6 border-t border-border pt-6 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium tracking-widest text-muted uppercase">Role</dt>
            <dd className="mt-2">{work.role}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium tracking-widest text-muted uppercase">Focus</dt>
            <dd className="mt-2">
              <TagList tags={work.tags} label={`${work.title} tags`} />
            </dd>
          </div>
          {work.link ? (
            <div>
              <dt className="text-xs font-medium tracking-widest text-muted uppercase">Live</dt>
              <dd className="mt-2">
                <a
                  href={work.link}
                  rel="noopener noreferrer"
                  className="underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
                >
                  {new URL(work.link).hostname}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </Container>

      <Container className="mt-12 sm:mt-16">
        <div className="card overflow-hidden p-[11px]">
          <Image
            src={work.cover.src}
            alt={work.cover.alt}
            width={cover.width}
            height={cover.height}
            priority
            sizes="(min-width: 1152px) 1088px, 100vw"
            className="h-auto w-full rounded-[9px]"
          />
        </div>
      </Container>
    </header>
  );
}
