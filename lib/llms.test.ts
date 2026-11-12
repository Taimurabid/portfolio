import { describe, expect, it } from "vitest";
import { getLlmsData, mdxToMarkdown, renderLlmsFull, renderLlmsTxt, type LlmsData } from "./llms";

describe("mdxToMarkdown", () => {
  const mdx = `
<CaseSection title="Overview">

FabricBloc is a platform.

</CaseSection>

<CaseSection title="The problem">
{/* TODO: write this. */}
</CaseSection>

<CaseSection title="What I designed">

- User flows

<Figure src="/work/x/screen-01.jpg" alt="Screen" />
{/* TODO: real screens. */}

</CaseSection>`;

  it("turns sections into headings and drops images and TODOs", () => {
    expect(mdxToMarkdown(mdx)).toBe(
      "### Overview\n\nFabricBloc is a platform.\n\n### What I designed\n\n- User flows",
    );
  });

  it("skips sections that only held a TODO, like the live page", () => {
    expect(mdxToMarkdown(mdx)).not.toContain("The problem");
  });
});

const fixture: LlmsData = {
  name: "Ada",
  role: "Designer",
  description: "I design things.",
  url: "https://example.com",
  about: "About Ada.",
  availability: "Open to work.",
  email: "ada@example.com",
  links: [{ label: "LinkedIn", href: "https://linkedin.com/in/ada" }],
  skills: [{ label: "Design", items: ["Figma"] }],
  experience: [{ org: "Acme", role: "Designer", years: "2020 – now" }],
  work: [
    {
      slug: "alpha",
      title: "Alpha",
      summary: "An app.",
      role: "Lead",
      tags: ["Mobile"],
      link: "https://alpha.app",
      body: '<CaseSection title="Overview">\n\nHello.\n\n</CaseSection>',
    },
  ],
  cvUrl: "/cv.pdf",
};

describe("renderLlmsTxt", () => {
  const text = renderLlmsTxt(fixture);

  it("follows the llms.txt shape: H1, blockquote, then link sections", () => {
    expect(text.startsWith("# Ada\n\n> Designer. I design things.")).toBe(true);
    expect(text).toContain("- [Alpha](https://example.com/work/alpha): An app. Role: Lead.");
    expect(text).toContain("- CV (PDF): https://example.com/cv.pdf");
    expect(text).toContain("(https://example.com/llms-full.txt)");
  });
});

describe("renderLlmsFull", () => {
  it("includes every case study body", () => {
    const text = renderLlmsFull(fixture);
    expect(text).toContain("## Alpha");
    expect(text).toContain("- Live: https://alpha.app");
    expect(text).toContain("### Overview\n\nHello.");
  });
});

describe("real site content", () => {
  const data = getLlmsData();
  const full = renderLlmsFull(data);

  it("covers every case study", () => {
    for (const work of data.work) expect(full).toContain(`## ${work.title}`);
    expect(data.work.length).toBeGreaterThan(0);
  });

  it("leaks no MDX, JSX or TODO notes", () => {
    expect(full).not.toMatch(/<CaseSection|<Figure|\{\/\*|TODO/);
  });
});
