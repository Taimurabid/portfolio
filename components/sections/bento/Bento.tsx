import { Container } from "@/components/ui/Container";
import { QaCard } from "@/components/qa/QaCard";
import { experience } from "@/lib/content";
import { getCv } from "@/lib/cv";
import { getAllWork } from "@/lib/work";
import { ExperienceCard } from "./ExperienceCard";
import { ImpactCard } from "./ImpactCard";
import { WhatIDoCard } from "./WhatIDoCard";
import { WhereCard } from "./WhereCard";
import { WorkPlayerCard } from "./WorkPlayerCard";

/**
 * Bento grid. At 1440px the columns reproduce the spec exactly:
 * row 1 = 370 · 513 · 371, row 2 = 370 · 330 · 554 (17px gaps), using four
 * tracks (370, 330, 166, 371) so both rows share edges where they should.
 */
export function Bento() {
  const slides = getAllWork().map(({ slug, title, role, cover }) => ({ slug, title, role, cover }));

  return (
    <Container className="mt-12 sm:mt-[50px]">
      <div
        data-inspect="Bento grid"
        data-qa="bento-grid"
        className={[
          "grid gap-[17px]",
          "[grid-template-areas:'exp'_'work'_'do'_'where'_'impact'_'how']",
          "md:grid-cols-2 md:[grid-template-areas:'work_work'_'exp_do'_'where_impact'_'how_how']",
          "bento:[grid-template-columns:370fr_330fr_166fr_371fr]",
          "bento:[grid-template-rows:minmax(258px,auto)_minmax(242px,auto)]",
          "bento:[grid-template-areas:'exp_work_work_do'_'where_impact_how_how']",
        ].join(" ")}
      >
        <ExperienceCard items={experience} index={5} />
        <WorkPlayerCard slides={slides} index={6} />
        <WhatIDoCard index={7} />
        <WhereCard index={8} />
        <ImpactCard index={9} />
        <QaCard index={10} cv={getCv()} />
      </div>
    </Container>
  );
}
