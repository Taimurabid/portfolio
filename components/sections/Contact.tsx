import { Section } from "@/components/ui/Section";
import { availability } from "@/lib/content";
import { getCv } from "@/lib/cv";
import { site } from "@/lib/site";

const profileLinks = [
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
].filter((link): link is { label: string; href: string } => Boolean(link.href));

export function Contact() {
  const cv = getCv();

  return (
    <Section id="contact" index="04" title="Contact">
      <div data-reveal className="max-w-3xl">
        <p className="text-lede text-muted">{availability}</p>
        <a
          href={`mailto:${site.email}`}
          className="mt-8 inline-block text-[clamp(1.375rem,0.9rem+2.6vw,2.75rem)] leading-tight font-medium tracking-[-0.025em] [overflow-wrap:anywhere] underline decoration-border decoration-1 underline-offset-[0.2em] transition-colors hover:text-accent hover:decoration-accent"
        >
          {site.email}
        </a>
        <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {profileLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                rel="me noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-lg transition-colors hover:text-accent"
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
          {cv ? (
            <li>
              <a
                href={cv.href}
                download
                className="group inline-flex items-center gap-1.5 text-lg transition-colors hover:text-accent"
              >
                Download CV
                <span aria-hidden="true" className="text-muted group-hover:text-accent">
                  ↓
                </span>
                <span className="text-sm text-muted">PDF · {cv.size}</span>
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </Section>
  );
}
