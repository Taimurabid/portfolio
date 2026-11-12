import type { ComponentPropsWithoutRef } from "react";
import { CaseSection } from "./CaseSection";
import { Figure } from "./Figure";

/** Hand-styled Markdown elements plus the custom components MDX files can use. */
export const mdxComponents = {
  CaseSection,
  Figure,
  p: (props: ComponentPropsWithoutRef<"p">) => <p {...props} />,
  h3: (props: ComponentPropsWithoutRef<"h3">) => <h3 className="!mt-10 text-h3" {...props} />,
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul
      className="space-y-2 [&>li]:relative [&>li]:pl-6 [&>li]:before:absolute [&>li]:before:top-[0.7em] [&>li]:before:left-1 [&>li]:before:size-1.5 [&>li]:before:rounded-full [&>li]:before:bg-accent [&>li]:before:content-['']"
      {...props}
    />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="list-decimal space-y-2 pl-6 marker:text-muted" {...props} />
  ),
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a
      className="underline decoration-border underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
      {...props}
    />
  ),
  strong: (props: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="border-l-2 border-accent pl-5 text-h3" {...props} />
  ),
};
