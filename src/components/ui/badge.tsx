import { cn } from "@/lib/utils";

type Tone =
  | "brand"
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "accent";

const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-200",
  neutral: "bg-ink-100 text-ink-600 ring-ink-200",
  success: "bg-success-50 text-success-700 ring-success-500/20",
  warning: "bg-warning-50 text-warning-600 ring-warning-500/20",
  danger: "bg-danger-50 text-danger-600 ring-danger-500/20",
  info: "bg-info-50 text-info-600 ring-info-500/20",
  accent: "bg-accent-500/10 text-accent-600 ring-accent-500/20",
};

export function Badge({
  tone = "neutral",
  className,
  children,
  dot = false,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  );
}
