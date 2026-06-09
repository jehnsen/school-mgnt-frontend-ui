import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export function Avatar({
  name,
  color,
  size = "md",
  className,
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-white",
        sizes[size],
        className,
      )}
      style={{
        background: color
          ? `linear-gradient(135deg, ${color}, ${color}cc)`
          : "linear-gradient(135deg, #6366f1, #a855f7)",
      }}
    >
      {initials(name)}
    </span>
  );
}
