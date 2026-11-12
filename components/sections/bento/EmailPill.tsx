"use client";

import { useEffect, useState } from "react";
import { CheckIcon, CopyIcon, MailIcon } from "@/components/ui/icons";

/** The spec's voice-note pill, reworked as a real control: email link plus copy. */
export function EmailPill({ email }: { email: string }) {
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
      // Clipboard blocked: the mailto link still works.
    }
  }

  return (
    <div
      data-inspect="EmailPill"
      className="flex h-[53px] items-center gap-2 rounded-full border border-border bg-surface pr-2 pl-3 shadow-card"
    >
      <a
        href={`mailto:${email}`}
        className="group flex min-w-0 flex-1 items-center gap-3 rounded-full py-1"
      >
        <span
          data-inspect="EmailPill · icon"
          data-qa="mail-dot"
          className="grid size-[29px] shrink-0 place-items-center rounded-full bg-accent text-accent-fg transition-transform group-hover:scale-105"
        >
          <MailIcon className="size-3.5" />
        </span>
        <span className="truncate text-[15px] transition-colors group-hover:text-accent-ink">
          <span className="sr-only">Email </span>
          {email}
        </span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-sm text-muted transition-colors hover:bg-chip hover:text-fg sm:px-3"
      >
        {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
        <span className="max-[400px]:sr-only">{copied ? "Copied" : "Copy"}</span>
        <span className="sr-only"> email address</span>
      </button>
      <span role="status" className="sr-only">
        {copied ? "Email address copied" : ""}
      </span>
    </div>
  );
}
