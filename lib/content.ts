/** Home page copy. Everything here comes from Taimur and his CV; anything unknown is a TODO. */

export const intro = {
  headline: "Hi I’m Taimur Abid — I’m a Full-Stack Engineer & Product Designer.",
  /** Shown in the muted colour after the headline. */
  previously: " Previously at MGB and ViewFi.",
  bio: "I design products in Figma and build them in React and Next.js. Seven years in, I still do both.",
};

export const about =
  "I have a CS degree, but my first paid work was design. Seven years later I still do both, which comes in handy on small teams where whoever designs the screen often ends up building it too. Until November 2026 I was a full-stack engineer and product designer at MGB (Mad Genius Blink), where most of my work was for BlocLabs and its products. Before that I spent two years leading product design at ViewFi.";

/** Skills, grouped exactly as on the CV. */
export const skills: { label: string; items: string[] }[] = [
  {
    label: "Design",
    items: [
      "Figma",
      "UI/UX Design",
      "Wireframing",
      "Prototyping",
      "Design Systems",
      "User Research",
      "Mobile App Design",
      "Webflow",
    ],
  },
  {
    label: "Frontend",
    items: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
      "Responsive Design",
    ],
  },
  {
    label: "Backend",
    items: [
      "Node.js",
      "Express",
      "Python",
      "FastAPI",
      "REST APIs",
      "PostgreSQL",
      "MongoDB",
      "Supabase",
    ],
  },
  {
    label: "AI",
    items: ["Python", "OpenAI API", "Claude API", "LangChain", "RAG", "Prompt Engineering"],
  },
  { label: "Tools", items: ["Claude Code", "Git", "GitHub", "Vercel", "Jira", "Agile/Scrum"] },
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
};

export const experience: ExperienceItem[] = [
  {
    org: "MGB (Mad Genius Blink)",
    role: "Full-Stack Engineer & Product Designer",
    start: "2023-10",
    end: "2026-11",
  },
  { org: "ViewFi", role: "Product Designer", start: "2021-10", end: "2023-09" },
  {
    org: "Freelance on Fiverr",
    role: "Freelance UI/UX Designer",
    start: "2019-08",
    end: "2021-09",
  },
  {
    org: "Forman Christian College (FCCU)",
    role: "BS Computer Science",
    start: "2019",
    end: "2019",
  },
];

/** The measured result featured on the bento's Impact card. */
export const impact = {
  slug: "viewfi",
  claim: "Cut ViewFi’s setup time by 30%",
};

export const availability = "I work US hours and I'm open to remote full-time or contract roles.";
