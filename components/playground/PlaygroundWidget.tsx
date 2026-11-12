"use client";

import dynamic from "next/dynamic";
import { LazyMount } from "@/components/ui/LazyMount";

const Playground = dynamic(() => import("@/components/playground/Playground"), { ssr: false });

/** The interactive part of the Playground section, fetched when it scrolls near. */
export function PlaygroundWidget() {
  return (
    <LazyMount minHeight={520} fallback={<div className="h-[520px] card animate-pulse" />}>
      <Playground />
    </LazyMount>
  );
}
