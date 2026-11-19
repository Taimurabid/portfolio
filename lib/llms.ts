/**
 * llms.txt (https://llmstxt.org): a plain-Markdown version of the site for AI
 * assistants. Rendering is pure (data in, string out) so it is unit-tested;
 * `getLlmsData` gathers the same content the pages use, so they never drift.
 */
import { about, availability, experience, skills } from "./content";
import { getCv } from "./cv";
import { formatYears } from "./format";
import { site } from "./site";
import { getAllWork, type CaseStudy } from "./work";

export type LlmsData = {
  name: string;
  role: string;
  description: string;
  url: string;
  about: string;
  availability: string;
  email: string;
  links: { label: string; href: string }[];
  skills: { label: string; items: string[] }[];
  experience: { org: string; role: string; years: string; summary: string }[];
  work: Pick<CaseStudy, "slug" | "title" | "summary" | "role" | "tags" | "link" | "body">[];
  cvUrl: string | null;
};

const COMMENT = /\{\/\*[\s\S]*?\*\/\}/g;
const FIGURE = /<Figure\b[^>]*\/>/g;
const SECTION = /<CaseSection\s+title="([^"]+)"\s*>([\s\S]*?)<\/CaseSection>/g;

/**
 * Case-study MDX → plain Markdown. TODO comments and images are dropped, and a
 * section left empty by that is skipped, exactly as the production page does.
 */
export function mdxToMarkdown(body: string): string {
  return body
    .replace(COMMENT, "")
    .replace(FIGURE, "")
    .replace(SECTION, (_, title: string, inner: string) => {
      const text = inner.trim();
      return text ? `### ${title}\n\n${text}\n\n` : "";
    })
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Card summaries are short phrases; end them with a full stop in prose. */
const sentence = (text: string) => (/[.!?]$/.test(text) ? text : `${text}.`);

const abs = (data: LlmsData, path: string) => new URL(path, data.url).toString();

function header(data: LlmsData): string[] {
  return [`# ${data.name}`, "", `> ${data.description}`, "", data.about, "", data.availability];
}

function profile(data: LlmsData): string[] {
  return [
    "## Experience",
    "",
    ...data.experience.map((e) => `- ${e.org}: ${e.role}, ${e.years}. ${e.summary}`),
    "",
    "## Skills",
    "",
    ...data.skills.map((s) => `- ${s.label}: ${s.items.join(", ")}`),
    "",
    "## Contact",
    "",
    `- Email: ${data.email}`,
    ...data.links.map((l) => `- ${l.label}: ${l.href}`),
    ...(data.cvUrl ? [`- CV (PDF): ${abs(data, data.cvUrl)}`] : []),
  ];
}

export function renderLlmsTxt(data: LlmsData): string {
  return [
    ...header(data),
    "",
    "## Case studies",
    "",
    ...data.work.map(
      (w) =>
        `- [${w.title}](${abs(data, `/work/${w.slug}`)}): ${sentence(w.summary)} Role: ${w.role}.`,
    ),
    "",
    ...profile(data),
    "",
    "## Optional",
    "",
    `- [Full content](${abs(data, "/llms-full.txt")}): every case study in full, as Markdown`,
    "",
  ].join("\n");
}

export function renderLlmsFull(data: LlmsData): string {
  const studies = data.work.flatMap((w) => [
    `## ${w.title}`,
    "",
    `- URL: ${abs(data, `/work/${w.slug}`)}`,
    `- Role: ${w.role}`,
    `- Focus: ${w.tags.join(", ")}`,
    ...(w.link ? [`- Live: ${w.link}`] : []),
    "",
    w.summary,
    "",
    mdxToMarkdown(w.body),
    "",
  ]);
  return [...header(data), "", ...profile(data), "", "# Case studies", "", ...studies].join("\n");
}

export function getLlmsData(): LlmsData {
  const cv = getCv();
  return {
    name: site.name,
    role: site.role,
    description: site.description,
    url: site.url,
    about: about.join("\n\n"),
    availability,
    email: site.email,
    links: [
      { label: "LinkedIn", href: site.links.linkedin },
      ...(site.links.github ? [{ label: "GitHub", href: site.links.github }] : []),
    ],
    skills,
    experience: experience.map((e) => ({
      org: e.org,
      role: e.role,
      years: formatYears(e.start, e.end),
      summary: e.summary,
    })),
    work: getAllWork(),
    cvUrl: cv?.href ?? null,
  };
}
