import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
  tone = "brand",
}: {
  value: number;
  className?: string;
  barClassName?: string;
  tone?: "brand" | "success" | "warning" | "danger" | "accent";
}) {
  const tones = {
    brand: "bg-brand-600",
    success: "bg-success-500",
    warning: "bg-warning-500",
    danger: "bg-danger-500",
    accent: "bg-accent-500",
  };
  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-ink-100", className)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500",
          tones[tone],
          barClassName,
        )}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
