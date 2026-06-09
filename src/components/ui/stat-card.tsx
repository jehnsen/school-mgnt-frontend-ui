import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { Card } from "./card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  tone = "brand",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  tone?: "brand" | "accent" | "success" | "warning" | "info";
}) {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    accent: "bg-accent-500/10 text-accent-600",
    success: "bg-success-50 text-success-600",
    warning: "bg-warning-50 text-warning-600",
    info: "bg-info-50 text-info-600",
  };
  const up = (trend ?? 0) >= 0;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl",
            tones[tone],
          )}
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        {trend !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold",
              up
                ? "bg-success-50 text-success-700"
                : "bg-danger-50 text-danger-600",
            )}
          >
            {up ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <p className="mt-4 font-display text-2xl font-bold tracking-tight text-ink-900">
        {value}
      </p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
      {trendLabel && (
        <p className="mt-2 text-xs text-ink-400">{trendLabel}</p>
      )}
    </Card>
  );
}
