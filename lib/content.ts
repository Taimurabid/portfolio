/** Home page copy. Everything here comes from Taimur; anything unknown is a TODO. */

export const intro = {
  headline: "Hi I’m Taimur Abid — I’m a Full-Stack Engineer & Product Designer at MGB.",
  /** Shown in the muted colour after the headline. */
  previously: " Previously at ViewFi.",
  bio: "I design products in Figma and build them in React and Next.js. Seven years in, I still do both.",
};

export const about =
  "I have a CS degree, but my first paid work was design. Seven years later I still do both, which comes in handy on small teams where whoever designs the screen often ends up building it too. Right now I'm a full-stack engineer and product designer at MGB (Mad Genius Blink), where most of my work is for BlocLabs and its products. Before that I spent two years leading product design at ViewFi.";

export type Discipline = {
  title: string;
  summary: string;
  /** Groups with no items yet are hidden on the site. */
  groups: { label: string; items: string[] }[];
};

export const disciplines: Discipline[] = [
  {
    title: "Design",
    summary: "Information architecture, user flows and high-fidelity screens, designed in Figma.",
    groups: [
      { label: "Tools", items: ["Figma", "Webflow"] }, // TODO: add the rest of your design tools.
    ],
  },
  {
    title: "Engineering",
    summary: "I build the products I design, in React and Next.js.",
    groups: [
      { label: "Frontend", items: ["React", "Next.js"] }, // TODO: add the rest of your frontend stack.
      { label: "Backend", items: [] }, // TODO: list backend tools (languages, frameworks, databases).
      { label: "AI", items: [] }, // TODO: list AI tools and models you work with.
    ],
  },
];

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
    end: null,
  },
  { org: "ViewFi", role: "Led product design", start: "2021-10", end: "2023-09" }, // TODO: confirm your exact job title.
  { org: "Freelance on Fiverr", role: "Freelance designer", start: "2019-08", end: "2021-09" }, // TODO: confirm how you describe this role.
  { org: "FCCU", role: "BS Computer Science", start: "2019", end: "2019" },
];

/** The measured result featured on the bento's Impact card. */
export const impact = {
  slug: "viewfi",
  claim: "Cut ViewFi’s setup time by 30%",
};

export const availability = "I work US hours and I'm open to remote full-time or contract roles.";
