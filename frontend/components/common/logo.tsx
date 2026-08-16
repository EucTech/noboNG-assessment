import { cn } from "@/lib/utils";

const BRAND_YELLOW = "#FFC907";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      role="img"
      aria-hidden="true"
      className={cn("size-8", className)}
    >
      <circle
        cx="60"
        cy="60"
        r="53"
        fill="none"
        stroke={BRAND_YELLOW}
        strokeWidth="9"
      />
      <g
        fill="none"
        stroke={BRAND_YELLOW}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M40 82V38" />
        <path d="M40 38l30 44" />
        <path d="M70 82V38" />
        <path d="M70 38h5a11 11 0 0 1 0 22h-5" />
        <path d="M70 60h9a11 11 0 0 1 0 22h-9" />
      </g>
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className={markClassName} />
      <span className="text-xl font-bold tracking-tight text-primary">
        NoboNG
      </span>
    </span>
  );
}
