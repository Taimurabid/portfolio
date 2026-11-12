import type { ReactNode } from "react";
import { slugify } from "@/lib/format";

type CaseSectionProps = {
  title: string;
  children?: ReactNode;
};

/**
 * One titled section of a case study. A section whose body is only a
 * `{/* TODO *\/}` comment has no children: in development it renders a visible
 * reminder, in production it is left out so the live site never shows an empty
 * heading.
 */
export function CaseSection({ title, children }: CaseSectionProps) {
  const id = slugify(title);
  const isEmpty = children === undefined || children === null;

  if (isEmpty && process.env.NODE_ENV !== "development") return null;

  return (
    <section
      aria-labelledby={id}
      data-reveal
      className="grid gap-6 border-t border-border py-10 first:border-t-0 sm:py-14 lg:grid-cols-12 lg:gap-8"
    >
      <h2 id={id} className="text-h3 lg:col-span-4">
        {title}
      </h2>
      <div className="min-w-0 lg:col-span-8">
        {isEmpty ? (
          <p className="rounded-lg border border-dashed border-accent p-4 text-sm text-accent">
            TODO: write “{title}”. This note only shows in development.
          </p>
        ) : (
          <div className="space-y-5 text-lg leading-relaxed">{children}</div>
        )}
      </div>
    </section>
  );
}
