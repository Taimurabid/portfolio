/** Home page copy. Everything here comes from Taimur and his CV; anything unknown is a TODO. */

export const intro = {
  headline: "I design products and build them, front to back.",
  bio: "Full-stack engineer and product designer. Figma, React and Next.js on the front, Node.js, NestJS and PostgreSQL on the back, with Web3 and AI where the product needs them. 7 years shipping SaaS, Web3 and creator products.",
};

/** About section, one string per paragraph. */
export const about = [
  "I have a CS degree, but my first paid work was design. Seven years later I still do both, and now I build the backend too. On small teams that means one person can take a feature from a Figma file to a working API and a shipped screen, without anything getting lost in between.",
  "Most recently I was a full-stack engineer and product designer at MGB (Mad Genius Blink), where I designed and built FabricBloc and KeyFlo for BlocLabs. Before that I was Lead Product Designer at ViewFi, where an onboarding redesign cut creator setup time by 30%.",
  "I work US hours from Lahore and I'm open to remote full-time or contract roles.",
];

/** Skills, grouped as on the website copy (the CV has the longer list). */
export const skills: { label: string; items: string[] }[] = [
  {
    label: "Design",
    items: [
      "Product design",
      "UX/UI",
      "User research",
      "Usability testing",
      "Design systems",
      "Prototyping",
      "Branding",
      "Figma",
      "Webflow",
    ],
  },
  { label: "Frontend", items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Swift"] },
  {
    label: "Backend",
    items: ["Node.js", "NestJS", "Express", "REST", "GraphQL", "PostgreSQL", "Redis", "Webhooks"],
  },
  { label: "Cloud", items: ["AWS", "Docker", "Vercel"] },
  { label: "Web3", items: ["Solidity", "Ethers.js", "Web3.js", "WalletConnect", "Privy"] },
  { label: "AI", items: ["OpenAI API", "Claude API", "MCP", "Claude Code"] },
];

/**
 * The bento "What I do" card: both disciplines, three headline skills each, so
 * each fits one line and the card keeps the spec height (full list in About).
 */
export const disciplines: { title: string; highlights: string[] }[] = [
  { title: "Design", highlights: ["Figma", "Design Systems", "Webflow"] },
  { title: "Engineering", highlights: ["React", "Next.js", "Node.js"] },
];

export const education = {
  school: "Forman Christian College (A Chartered University)",
  degree: "BS Computer Science",
  place: "Lahore",
  year: "2019",
};

export type ExperienceItem = {
  org: string;
  role: string;
  /** ISO year or year-month, used for <time dateTime>. `end: null` means present. */
  start: string;
  end: string | null;
  /** One line on what the role was about. */
  summary: string;
};

export const experience: ExperienceItem[] = [
  {
    org: "MGB (Mad Genius Blink)",
    role: "Full-Stack Engineer & Product Designer",
    start: "2023-10",
    end: "2026-11",
    summary:
      "Designed and built FabricBloc and KeyFlo for BlocLabs, from Figma to NestJS APIs on AWS, plus AI features with OpenAI, Claude and MCP.",
  },
  {
    org: "ViewFi",
    role: "Lead Product Designer",
    start: "2021-10",
    end: "2023-09",
    summary:
      "Led design for a reward-based video ad platform; cut creator setup time by 30%, and worked on its payments, wallet and video services.",
  },
  {
    org: "Fiverr",
    role: "Freelance UI/UX Designer",
    start: "2019-08",
    end: "2021-09",
    summary:
      "100+ projects for international clients: websites, app screens, logos and brand guides.",
  },
  {
    org: "Forman Christian College (FCCU)",
    role: "BS Computer Science",
    start: "2019",
    end: "2019",
    summary: "Graduated in Lahore.",
  },
];

/** The measured result featured on the bento's Impact card. */
export const impact = {
  slug: "viewfi",
  claim: "Cut ViewFi’s setup time by 30%",
};

export const availability =
  "I work US hours and I'm available now for remote full-time or contract roles.";

export const contactHeading = "Let’s build something.";
