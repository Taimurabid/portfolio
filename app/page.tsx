import { About } from "@/components/sections/About";
import { Bento } from "@/components/sections/bento/Bento";
import { Intro } from "@/components/sections/bento/Intro";
import { Contact } from "@/components/sections/Contact";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/lib/site";

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.role,
  description: site.description,
  url: site.url,
  email: `mailto:${site.email}`,
  worksFor: { "@type": "Organization", name: "MGB (Mad Genius Blink)" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "FCCU" },
  sameAs: Object.values(site.links).filter(Boolean),
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={person} />
      <Intro />
      <Bento />
      <SelectedWork />
      <About />
      <Contact />
    </>
  );
}
