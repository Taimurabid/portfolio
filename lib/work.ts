import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";
import { getImageSize } from "./images";

const WORK_DIR = path.join(process.cwd(), "content", "work");

const imageSchema = z.object({
  src: z.string().startsWith("/", "Image paths are relative to /public, e.g. /work/key3/cover.jpg"),
  alt: z.string().min(1, "Every image needs alt text"),
});

/** The contract every file in content/work/*.mdx must satisfy. */
const frontmatterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1).max(120, "Keep the card summary to one line"),
  role: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1).max(4),
  order: z.number().int(),
  link: z.url().optional(),
  cover: imageSchema,
});

type Frontmatter = z.infer<typeof frontmatterSchema>;
export type Image = z.infer<typeof imageSchema>;

export type CaseStudy = Frontmatter & {
  slug: string;
  /** Raw MDX body, rendered on the case study page. */
  body: string;
};

function parseFile(file: string): CaseStudy {
  const raw = readFileSync(path.join(WORK_DIR, file), "utf8");
  const { data, content } = matter(raw);
  const result = frontmatterSchema.safeParse(data);

  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in content/work/${file}:\n${z.prettifyError(result.error)}`,
    );
  }

  try {
    getImageSize(result.data.cover.src);
  } catch (error) {
    throw new Error(`content/work/${file}: ${(error as Error).message}`);
  }
  return { ...result.data, slug: file.replace(/\.mdx$/, ""), body: content };
}

/** All case studies, sorted by `order`. Validated at build time, so bad content fails the build. */
export const getAllWork = cache((): CaseStudy[] =>
  readdirSync(WORK_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map(parseFile)
    .sort((a, b) => a.order - b.order),
);

export function getWork(slug: string): CaseStudy | undefined {
  return getAllWork().find((work) => work.slug === slug);
}

/** The case study after `slug`, wrapping from the last back to the first. */
export function getNextWork(slug: string): CaseStudy {
  const all = getAllWork();
  const index = all.findIndex((work) => work.slug === slug);
  const next = all[(index + 1) % all.length];
  if (!next) throw new Error("content/work has no case studies");
  return next;
}
