import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MotionToggle } from "@/components/ui/MotionToggle";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navItems, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between gap-2">
        <Link
          href="/"
          className="text-[15px] font-semibold tracking-tight whitespace-nowrap transition-colors hover:text-accent"
        >
          {site.name}
        </Link>

        <nav aria-label="Primary" className="flex items-center sm:gap-2">
          <ul className="flex items-center">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex h-10 items-center rounded-full px-1.5 text-sm text-muted transition-colors hover:text-fg sm:px-3"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <MotionToggle />
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
