import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Container className="py-24 sm:py-36">
      <p className="text-sm font-medium tracking-widest text-accent-ink uppercase">404</p>
      <h1 className="mt-4 text-h1">This page doesn’t exist.</h1>
      <p className="mt-6 max-w-prose text-lede text-muted">
        The link may be old, or the address may have a typo.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex h-12 items-center rounded-full bg-accent px-6 font-medium text-accent-fg transition-opacity hover:opacity-90"
      >
        Back to the home page
      </Link>
    </Container>
  );
}
