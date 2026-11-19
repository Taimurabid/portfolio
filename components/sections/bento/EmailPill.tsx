import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { MailIcon } from "@/components/ui/icons";

/** The spec's voice-note pill, reworked as a real control: email link plus copy. */
export function EmailPill({ email }: { email: string }) {
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
      <CopyEmailButton
        email={email}
        className="inline-flex h-9 min-w-9 shrink-0 items-center justify-center gap-1.5 rounded-full px-2.5 text-sm text-muted transition-colors hover:bg-chip hover:text-fg sm:px-3"
        labelClassName="max-[400px]:sr-only"
      />
    </div>
  );
}
