import type { ComponentPropsWithoutRef, ElementType } from "react";

type ContainerProps<T extends ElementType> = {
  as?: T;
  width?: "page" | "prose";
} & ComponentPropsWithoutRef<T>;

const widths = {
  page: "max-w-page",
  prose: "max-w-prose",
} as const;

/** Centers content with the site's horizontal gutter (16px on phones). */
export function Container<T extends ElementType = "div">({
  as,
  width = "page",
  className = "",
  ...props
}: ContainerProps<T>) {
  const Component: ElementType = as ?? "div";
  return (
    <Component
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${widths[width]} ${className}`}
      {...props}
    />
  );
}
