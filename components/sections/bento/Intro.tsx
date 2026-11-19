import Image from "next/image";
import type { CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { intro } from "@/lib/content";
import { getCv } from "@/lib/cv";
import { site } from "@/lib/site";
import { AvailablePill } from "./AvailablePill";
import { CvPill } from "./CvPill";
import { EmailPill } from "./EmailPill";

const enter = (i: number) => ({ "--i": i }) as CSSProperties;

export function Intro() {
  const cv = getCv();

  return (
    <section aria-labelledby="intro-heading" className="pt-8 sm:pt-12 bento:pt-[18px]">
      <Container>
        <div className="grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10 bento:pl-[60px]">
          <Image
            src="/avatar.jpg"
            // Monogram from scripts/avatar.mjs (options in design/avatar-options/).
            // To use a photo instead, replace public/avatar.jpg and describe it here.
            alt={`${site.name} monogram`}
            width={145}
            height={145}
            priority
            data-enter
            data-inspect="Avatar"
            style={enter(0)}
            className="size-24 rounded-[11px] object-cover sm:size-[145px]"
          />
          <div className="min-w-0 bento:pt-2.5">
            <div data-enter style={enter(1)} className="mb-4">
              <AvailablePill />
            </div>
            <h1
              id="intro-heading"
              data-inspect="Headline"
              data-qa="headline"
              data-enter="lift"
              style={enter(2)}
              className="max-w-[900px] text-headline"
            >
              {intro.headline}
            </h1>
            <p
              data-enter="lift"
              data-inspect="Bio"
              style={enter(3)}
              className="mt-4 max-w-[790px] text-bio text-muted sm:mt-5"
            >
              {intro.bio}
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:gap-[25px] bento:mt-[22px]">
              <div data-enter style={enter(4)} className="w-full max-w-[495px]">
                <EmailPill email={site.email} />
              </div>
              <div data-enter style={enter(5)}>
                <a
                  href="#work"
                  className="inline-flex h-[53px] items-center gap-2 rounded-full bg-segment px-5 text-[15px] whitespace-nowrap text-segment-fg shadow-card transition-opacity hover:opacity-90"
                >
                  See my work <span aria-hidden="true">→</span>
                </a>
              </div>
              {cv ? (
                <div data-enter style={enter(6)}>
                  <CvPill cv={cv} />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
