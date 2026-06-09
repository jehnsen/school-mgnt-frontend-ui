/* Pure-SVG area chart — no dependencies, responsive via viewBox. */

export function AreaChart({
  data,
  height = 220,
  className,
}: {
  data: { label: string; value: number }[];
  height?: number;
  className?: string;
}) {
  const width = 600;
  const pad = { top: 16, right: 8, bottom: 28, left: 8 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const max = Math.max(...data.map((d) => d.value)) * 1.05;
  const min = Math.min(...data.map((d) => d.value)) * 0.92;
  const range = max - min || 1;

  const points = data.map((d, i) => {
    const x = pad.left + (i / (data.length - 1)) * w;
    const y = pad.top + h - ((d.value - min) / range) * h;
    return { x, y, ...d };
  });

  const line = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
  const area =
    `${line} L ${points[points.length - 1].x.toFixed(1)} ${pad.top + h} ` +
    `L ${points[0].x.toFixed(1)} ${pad.top + h} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      preserveAspectRatio="none"
      style={{ width: "100%", height }}
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gridlines */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={pad.left}
          x2={pad.left + w}
          y1={pad.top + h * g}
          y2={pad.top + h * g}
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke="#4f46e5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#fff" stroke="#4f46e5" strokeWidth="2.5" />
          <text
            x={p.x}
            y={height - 8}
            textAnchor="middle"
            className="fill-ink-400"
            style={{ fontSize: 11 }}
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
