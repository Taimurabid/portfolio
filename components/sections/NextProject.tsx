import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { CaseStudy } from "@/lib/work";

export function NextProject({ work }: { work: CaseStudy }) {
  return (
    <nav aria-label="Next project">
      <Container className="pb-16 sm:pb-24">
        <Link
          href={`/work/${work.slug}`}
          className="card-hover group block card p-6 outline-offset-4 sm:p-10"
        >
          <span className="text-xs font-medium tracking-widest text-muted uppercase">
            Next project
          </span>
          <span className="mt-4 flex items-baseline justify-between gap-6">
            <span className="text-h1 font-[520] transition-colors group-hover:text-accent-ink">
              {work.title}
            </span>
            <span
              aria-hidden="true"
              className="text-h2 text-muted transition-[color,transform] duration-300 group-hover:translate-x-2 group-hover:text-accent"
            >
              →
            </span>
          </span>
          <span className="mt-4 block max-w-prose text-muted">{work.summary}</span>
        </Link>
      </Container>
    </nav>
  );
}
