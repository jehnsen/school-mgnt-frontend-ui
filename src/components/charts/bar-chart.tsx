import { cn } from "@/lib/utils";

/* CSS-based horizontal bar list — accessible and crisp at any size. */

export function BarList({
  data,
  valueFormatter = (n) => n.toLocaleString(),
  className,
}: {
  data: { label: string; value: number; color?: string }[];
  valueFormatter?: (n: number) => string;
  className?: string;
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1;

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((d) => (
        <div key={d.label}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-ink-700">{d.label}</span>
            <span className="tabular-nums text-ink-500">
              {valueFormatter(d.value)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(d.value / max) * 100}%`,
                background: d.color ?? "#4f46e5",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* Vertical mini bar chart (e.g. weekly load). */
export function ColumnChart({
  data,
  height = 160,
  valueSuffix = "",
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  valueSuffix?: string;
}) {
  const max = Math.max(...data.map((d) => d.value)) || 1;
  return (
    <div className="flex items-end gap-3" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex w-full flex-1 items-end">
            <div
              className="group relative w-full rounded-t-lg transition-all duration-500 hover:opacity-90"
              style={{
                height: `${(d.value / max) * 100}%`,
                background: d.color ?? "#4f46e5",
              }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-ink-900 px-1.5 py-0.5 text-[10px] font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100">
                {d.value}
                {valueSuffix}
              </span>
            </div>
          </div>
          <span className="text-[11px] text-ink-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
