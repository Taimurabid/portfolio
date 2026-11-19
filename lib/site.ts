/** The address on the CV; the older vercel.app URL redirects here. */
const PRODUCTION_URL = "https://taimur-portfolio-1.vercel.app";

/**
 * Absolute site URL for canonical links, OG images, the sitemap and llms.txt.
 * Always the production address (previews and local builds included), so
 * nothing ever points search engines at a redirect. Set NEXT_PUBLIC_SITE_URL
 * to switch to a custom domain.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? PRODUCTION_URL;

export const site = {
  name: "Taimur Abid",
  role: "Full-Stack Engineer & Product Designer",
  description:
    "Full-stack engineer and product designer with 7 years building SaaS, Web3 and AI products. React, Next.js, Node.js, NestJS, PostgreSQL. Available for remote roles.",
  url: siteUrl,
  email: "taimurmirza717@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/taimur-abid-6b279a259",
    github: "https://github.com/Taimurabid" as string | null,
  },
} as const;

export const navItems = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;
