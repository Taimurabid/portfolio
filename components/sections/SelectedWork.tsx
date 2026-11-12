import type { CSSProperties } from "react";
import { Section } from "@/components/ui/Section";
import { getAllWork } from "@/lib/work";
import { WorkCard } from "./WorkCard";

export function SelectedWork() {
  const work = getAllWork();

  return (
    <Section id="work" index="01" title="Selected work">
      <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-x-16">
        {work.map((item, i) => {
          // On phones the first cover peeks above the fold and is the LCP element:
          // load it eagerly and never hide it behind the scroll reveal.
          const isFirst = i === 0;
          return (
            <li
              key={item.slug}
              data-reveal={isFirst ? undefined : ""}
              // Second column sits lower for an editorial, staggered rhythm.
              className="md:even:mt-24"
              style={{ "--reveal-delay": `${(i % 2) * 90}ms` } as CSSProperties}
            >
              <WorkCard work={item} index={i} priority={isFirst} />
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
