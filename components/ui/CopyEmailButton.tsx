"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/ui/icons";

/** Copies the email address, shows "Copied" for 2s and announces it to screen readers. */
export function CopyEmailButton({
  email,
  className = "",
  labelClassName = "",
}: {
  email: string;
  className?: string;
  /** Lets the hero pill hide the word on very narrow screens. */
  labelClassName?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard blocked: the mailto link next to it still works.
    }
  }

  return (
    <>
      <button type="button" onClick={copy} className={className}>
        {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        <span className={labelClassName}>{copied ? "Copied" : "Copy"}</span>
        <span className="sr-only"> email address</span>
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </>
  );
}
