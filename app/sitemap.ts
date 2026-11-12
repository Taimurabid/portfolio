import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllWork } from "@/lib/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const work = getAllWork().map(({ slug }) => ({
    url: new URL(`/work/${slug}`, site.url).toString(),
    changeFrequency: "yearly" as const,
    priority: 0.8,
  }));

  return [
    { url: new URL("/", site.url).toString(), changeFrequency: "monthly", priority: 1 },
    ...work,
  ];
}
