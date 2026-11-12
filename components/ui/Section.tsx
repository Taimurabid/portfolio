import type { ReactNode } from "react";
import { Container } from "./Container";
import { SectionHeader } from "./SectionHeader";

type SectionProps = {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
};

/** A home-page section: anchor target, header and consistent vertical rhythm. */
export function Section({ id, index, title, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="py-20 sm:py-28">
      <Container>
        <div data-reveal>
          <SectionHeader index={index} title={title} id={headingId} />
        </div>
        <div className="mt-12 sm:mt-16">{children}</div>
      </Container>
    </section>
  );
}
