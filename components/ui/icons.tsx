import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/** 16px line icons, 1.6px stroke, decorative by default. */
function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width="16"
      height="16"
      {...props}
    >
      {children}
    </svg>
  );
}

export const BriefcaseIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2" y="5" width="12" height="8.5" rx="1.5" />
    <path d="M6 5V3.5A1 1 0 0 1 7 2.5h2a1 1 0 0 1 1 1V5M2 9h12" />
  </Icon>
);
export const GridIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
  </Icon>
);
export const PenIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M10.5 2.5l3 3L6 13H3v-3z" />
  </Icon>
);
export const GlobeIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="5.5" />
    <path d="M2.5 8h11M8 2.5c1.6 1.6 2.3 3.4 2.3 5.5S9.6 11.9 8 13.5C6.4 11.9 5.7 10.1 5.7 8S6.4 4.1 8 2.5z" />
  </Icon>
);
export const StepsIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2.5 13.5h3.5v-3.5h3.5V6.5H13V3" />
  </Icon>
);
export const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
    <path d="M2.5 4.5 8 9l5.5-4.5" />
  </Icon>
);
export const CopyIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5V3.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" />
  </Icon>
);
export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8.5 6.5 12 13 4.5" />
  </Icon>
);
export const ArrowIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </Icon>
);
export const PlayIcon = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <path d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5z" />
  </Icon>
);
export const PauseIcon = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <rect x="4" y="3" width="2.6" height="10" rx="0.8" />
    <rect x="9.4" y="3" width="2.6" height="10" rx="0.8" />
  </Icon>
);
export const PrevIcon = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <path d="M12.5 3.6v8.8a.6.6 0 0 1-.9.5L5.4 8.5a.6.6 0 0 1 0-1l6.2-4.4a.6.6 0 0 1 .9.5zM3 3h1.6v10H3z" />
  </Icon>
);
export const NextIcon = (p: IconProps) => (
  <Icon {...p} fill="currentColor" stroke="none">
    <path d="M3.5 3.6v8.8a.6.6 0 0 0 .9.5l6.2-4.4a.6.6 0 0 0 0-1L4.4 3.1a.6.6 0 0 0-.9.5zM11.4 3H13v10h-1.6z" />
  </Icon>
);
export const BugIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4.5" y="5" width="7" height="8.5" rx="3.5" />
    <path d="M6 5V4a2 2 0 0 1 4 0v1M8 8v5.5M2 8.5h2.5M11.5 8.5H14M2.5 5l2 1.5M13.5 5l-2 1.5M2.5 13l2-1.5M13.5 13l-2-1.5" />
  </Icon>
);
export const DownloadIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" />
  </Icon>
);
