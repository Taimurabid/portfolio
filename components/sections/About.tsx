import { Section } from "@/components/ui/Section";
import { Tag } from "@/components/ui/Tag";
import { about, skills } from "@/lib/content";

export function About() {
  return (
    <Section id="about" index="03" title="About">
      <p data-reveal className="max-w-3xl text-lede">
        {about}
      </p>
      <div data-reveal className="mt-14 sm:mt-16">
        <h3 className="text-h3">What I work with</h3>
        <dl className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          {skills.map((group) => (
            <div key={group.label}>
              <dt className="text-xs font-medium tracking-widest text-muted uppercase">
                {group.label}
              </dt>
              <dd className="mt-3 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
