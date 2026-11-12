/**
 * Absolute site URL for canonical links, OG images and the sitemap.
 * Set NEXT_PUBLIC_SITE_URL once you have a custom domain; until then Vercel's
 * production URL is used, then localhost.
 */
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const site = {
  name: "Taimur Abid",
  role: "Full-Stack Engineer & Product Designer",
  description: "I design products in Figma and build them in React and Next.js.",
  url: getSiteUrl(),
  email: "taimurmirza717@gmail.com",
  links: {
    linkedin: "https://www.linkedin.com/in/taimur-abid-6b279a259",
    // TODO: add GitHub profile URL.
    github: null as string | null,
  },
} as const;

export const navItems = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
] as const;
