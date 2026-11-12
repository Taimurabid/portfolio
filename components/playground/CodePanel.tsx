"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";

/** Light highlighting (tags and class strings) without a syntax-highlighting library. */
function highlight(code: string) {
  return code.split(/("[^"]*"|<\/?[a-z0-9]+)/g).map((part, i) => {
    if (part.startsWith('"'))
      return (
        <span key={i} className="text-accent-ink">
          {part}
        </span>
      );
    if (part.startsWith("<"))
      return (
        <span key={i} className="font-semibold">
          {part}
        </span>
      );
    return part;
  });
}

export function CodePanel({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      // Clipboard blocked: the code is still selectable.
    }
  };

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <p className="font-mono text-xs text-muted">SketchedComponent.tsx</p>
        <button
          type="button"
          onClick={copy}
          className="inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs text-muted transition-colors hover:bg-chip hover:text-fg"
        >
          {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
          {copied ? "Copied" : "Copy code"}
        </button>
      </div>
      <pre className="max-h-[320px] overflow-auto p-4 font-mono text-[12px] leading-relaxed">
        <code>{highlight(code)}</code>
      </pre>
      <span role="status" className="sr-only">
        {copied ? "Code copied" : ""}
      </span>
    </div>
  );
}
