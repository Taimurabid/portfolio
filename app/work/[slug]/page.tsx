import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { CaseStudyHeader } from "@/components/sections/CaseStudyHeader";
import { NextProject } from "@/components/sections/NextProject";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { site } from "@/lib/site";
import { caseStudySchema } from "@/lib/structured-data";
import { getAllWork, getNextWork, getWork } from "@/lib/work";

type PageProps = { params: Promise<{ slug: string }> };

// Every case study is known at build time; unknown slugs 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllWork().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const work = getWork((await params).slug);
  if (!work) return {};
  const url = `/work/${work.slug}`;
  return {
    title: work.title,
    description: work.summary,
    alternates: { canonical: url },
    // Replaces the root openGraph object, so siteName is repeated here.
    openGraph: {
      type: "article",
      siteName: site.name,
      url,
      title: `${work.title}: a case study by ${site.name}`,
      description: work.summary,
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const work = getWork((await params).slug);
  if (!work) notFound();

  return (
    <article>
      <JsonLd data={caseStudySchema(work)} />
      <CaseStudyHeader work={work} />
      <Container className="py-12 sm:py-16">
        <div className="card px-5 sm:px-10 lg:px-14">
          <MDXRemote source={work.body} components={mdxComponents} />
        </div>
      </Container>
      <NextProject work={getNextWork(work.slug)} />
    </article>
  );
}
