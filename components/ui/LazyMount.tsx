"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Renders `children` only once this spot is near the viewport, so heavy,
 * below-the-fold widgets don't cost anything on first load.
 */
export function LazyMount({
  children,
  fallback,
  minHeight,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  minHeight: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return setVisible(true);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : fallback}
    </div>
  );
}
