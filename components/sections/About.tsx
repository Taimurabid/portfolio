import { Section } from "@/components/ui/Section";
import { about } from "@/lib/content";

export function About() {
  return (
    <Section id="about" index="02" title="About">
      <p data-reveal className="max-w-3xl text-lede">
        {about}
      </p>
    </Section>
  );
}
