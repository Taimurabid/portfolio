/** schema.org JSON-LD for search engines and AI assistants. */
import { education, skills } from "./content";
import { site } from "./site";
import type { CaseStudy } from "./work";

const abs = (path: string) => new URL(path, site.url).toString();

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    description: site.description,
    url: site.url,
    image: abs("/avatar.jpg"),
    email: `mailto:${site.email}`,
    worksFor: { "@type": "Organization", name: "MGB (Mad Genius Blink)" },
    alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
    knowsAbout: [...new Set(skills.flatMap((group) => group.items))],
    sameAs: Object.values(site.links).filter(Boolean),
  };
}

export function caseStudySchema(work: CaseStudy) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: work.title,
    description: work.summary,
    url: abs(`/work/${work.slug}`),
    image: abs(work.cover.src),
    keywords: work.tags.join(", "),
    creator: { "@type": "Person", name: site.name, url: site.url },
    ...(work.link ? { sameAs: work.link } : {}),
  };
}
