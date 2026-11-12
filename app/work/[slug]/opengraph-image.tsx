import { ogContentType, ogSize, renderOgImage } from "@/lib/og";
import { site } from "@/lib/site";
import { getAllWork, getWork } from "@/lib/work";

type Props = { params: Promise<{ slug: string }> };

export const size = ogSize;
export const contentType = ogContentType;
export const alt = `Case study by ${site.name}`;

export function generateStaticParams() {
  return getAllWork().map(({ slug }) => ({ slug }));
}

export default async function OpengraphImage({ params }: Props) {
  const work = getWork((await params).slug);
  return renderOgImage({
    eyebrow: "Case study",
    title: work?.title ?? site.name,
    subtitle: work?.role,
    description: work?.summary ?? site.description,
  });
}
