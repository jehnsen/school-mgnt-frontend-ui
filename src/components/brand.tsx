import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-glow",
        size === "md" ? "h-9 w-9" : "h-8 w-8",
        className,
      )}
    >
      <svg viewBox="0 0 32 32" className={size === "md" ? "h-5 w-5" : "h-4 w-4"} fill="none">
        <path d="M16 6 L27 11 L16 16 L5 11 Z" fill="currentColor" />
        <path
          d="M9 14 L9 20 C9 22.2 12.1 24 16 24 C19.9 24 23 22.2 23 20 L23 14 L16 17.5 Z"
          fill="currentColor"
          fillOpacity="0.7"
        />
      </svg>
    </span>
  );
}

export function Wordmark({
  href = "/",
  className,
  invert = false,
}: {
  href?: string;
  className?: string;
  invert?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <Logo />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[17px] font-bold tracking-tight",
            invert ? "text-white" : "text-ink-900",
          )}
        >
          Akademya
          <span className="text-brand-500">360</span>
        </span>
        <span
          className={cn(
            "mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em]",
            invert ? "text-white/50" : "text-ink-400",
          )}
        >
          Academic Suite
        </span>
      </span>
    </Link>
  );
}
