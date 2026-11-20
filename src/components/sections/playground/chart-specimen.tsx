"use client";

import { useId, useMemo, useState, type KeyboardEvent, type PointerEvent } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { linePaths, nearestIndex, niceMax, toPoints } from "@/lib/chart";
import type { Playground } from "@/lib/content";
import { cn } from "@/lib/utils";

const W = 600;
const H = 220;
const RANGES = [7, 14, 30] as const;
const format = (n: number, prefix: string) => `${prefix}${n.toLocaleString("en-US")}`;

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  render,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  render: (v: T) => string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="flex gap-1 rounded-full border bg-subtle p-1"
    >
      {options.map((o) => (
        <button
          key={String(o)}
          type="button"
          role="radio"
          aria-checked={o === value}
          onClick={() => onChange(o)}
          className={cn(
            "h-8 rounded-full px-3 text-xs transition-[background-color,color] duration-200",
            o === value
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {render(o)}
        </button>
      ))}
    </div>
  );
}

/** Dependency-free SVG line chart: series + range controls, pointer/keyboard crosshair. */
export function ChartSpecimen({ chart }: { chart: Playground["chart"] }) {
  const reduceMotion = usePrefersReducedMotion();
  const clipId = `chart-clip-${useId().replace(/[^\w-]/g, "")}`;
  const [seriesId, setSeriesId] = useState(chart.series[0].id);
  const [range, setRange] = useState<(typeof RANGES)[number]>(14);
  const [active, setActive] = useState<number | null>(null);

  const series = chart.series.find((s) => s.id === seriesId) ?? chart.series[0];
  const values = series.values.slice(-range);
  const labels = chart.labels.slice(-range);
  const max = niceMax(Math.max(...values));
  const points = useMemo(() => toPoints(values, W, H, max), [values, max]);
  const { line, area } = linePaths(points, H);
  const total = values.reduce((a, b) => a + b, 0);
  const shown = active ?? values.length - 1;

  const onPointer = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setActive(nearestIndex(((e.clientX - r.left) / r.width) * W, W, values.length));
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const delta = e.key === "ArrowRight" ? 1 : -1;
    setActive(Math.min(Math.max((active ?? values.length - 1) + delta, 0), values.length - 1));
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            {series.label} · last {range} days
          </p>
          <p className="text-2xl font-semibold tracking-tight tabular-nums">
            {format(total, series.prefix)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Segmented
            label="Series"
            options={chart.series.map((s) => s.id)}
            value={seriesId}
            onChange={(v) => {
              setSeriesId(v);
              setActive(null);
            }}
            render={(id) => chart.series.find((s) => s.id === id)?.label ?? id}
          />
          <Segmented
            label="Range"
            options={RANGES}
            value={range}
            onChange={(v) => {
              setRange(v);
              setActive(null);
            }}
            render={(v) => `${v}D`}
          />
        </div>
      </div>

      <div
        role="group"
        tabIndex={0}
        aria-label={`${series.label} chart. Use left and right arrow keys to inspect days.`}
        onKeyDown={onKey}
        className="relative rounded-lg outline-offset-4"
      >
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-48 w-full overflow-visible text-foreground sm:h-56"
          onPointerMove={onPointer}
          onPointerLeave={() => setActive(null)}
          aria-hidden
          data-testid="chart-svg"
        >
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={0}
              x2={W}
              y1={H - f * H}
              y2={H - f * H}
              className="stroke-border"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* Draw-in via clip reveal (pathLength is unreliable with non-scaling strokes). */}
          <defs>
            <clipPath id={clipId}>
              <motion.rect
                key={`${seriesId}-${range}`}
                x={0}
                y={-10}
                height={H + 20}
                initial={{ width: reduceMotion ? W : 0 }}
                animate={{ width: W }}
                transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <path d={area} className="fill-current opacity-[0.06]" />
            <path
              d={line}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
            />
          </g>
          {active !== null && (
            <line
              x1={points[active].x}
              x2={points[active].x}
              y1={0}
              y2={H}
              className="stroke-border-strong"
              strokeDasharray="4 4"
              vectorEffect="non-scaling-stroke"
            />
          )}
        </svg>
        {/* Point marker + tooltip as HTML so they don't stretch with the SVG. */}
        <span
          aria-hidden
          className="pointer-events-none absolute size-2.5 -translate-1/2 rounded-full border-2 border-background bg-signal shadow-sm transition-[left,top] duration-150"
          style={{
            left: `${(points[shown].x / W) * 100}%`,
            top: `${(points[shown].y / H) * 100}%`,
          }}
        />
        <div
          aria-live="polite"
          data-testid="chart-tooltip"
          className="pointer-events-none absolute top-1 rounded-md border bg-surface-raised px-2 py-1 text-xs whitespace-nowrap shadow-sm"
          style={{
            left: `${(points[shown].x / W) * 100}%`,
            transform: `translateX(${shown > values.length / 2 ? "calc(-100% - 8px)" : "8px"})`,
          }}
        >
          <span className="text-muted-foreground">{labels[shown]} · </span>
          <span className="font-medium tabular-nums">{format(values[shown], series.prefix)}</span>
        </div>
      </div>
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}
