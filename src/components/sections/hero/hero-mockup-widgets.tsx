"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { HeroMockup } from "@/lib/content";
import { cn } from "@/lib/utils";

const STATUS_DOT = {
  success: "bg-foreground",
  pending: "bg-signal",
  neutral: "bg-border-strong",
} as const;

/** Bar chart with hover/focus value tooltips; bars grow in after the hero entrance. */
export function MockupChart({
  chart,
  reduceMotion,
}: {
  chart: HeroMockup["chart"];
  reduceMotion: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...chart.points.map((p) => p.value), 1);

  return (
    <figure className="flex flex-col rounded-lg border bg-surface p-2.5">
      <figcaption className="text-muted-foreground">{chart.title}</figcaption>
      <div
        className="relative mt-2 flex h-28 flex-1 items-end gap-1.5"
        onPointerLeave={() => setHovered(null)}
      >
        {chart.points.map((p, i) => (
          <button
            key={p.label}
            type="button"
            aria-label={`${p.label}: ${p.value}`}
            onPointerEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
            onBlur={() => setHovered(null)}
            className="relative flex h-full flex-1 flex-col items-center justify-end gap-1"
          >
            <AnimatePresence>
              {hovered === i && (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-1 z-10 rounded bg-foreground px-1.5 py-0.5 font-mono text-[10px] text-background"
                >
                  {p.value}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span
              className={cn(
                "w-full origin-bottom rounded-sm transition-colors",
                hovered === null || hovered === i ? "bg-foreground" : "bg-border-strong",
              )}
              style={{ height: `${(p.value / max) * 78}%` }}
              initial={reduceMotion ? false : { scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.9 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            />
            <span className="font-mono text-[9px] text-muted-foreground">{p.label[0]}</span>
          </button>
        ))}
      </div>
    </figure>
  );
}

/** Orders table filtered by the mockup search query, with an empty state. */
export function MockupTable({ table, query }: { table: HeroMockup["table"]; query: string }) {
  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? table.rows.filter((r) => r.name.toLowerCase().includes(q)) : table.rows;
  }, [table.rows, query]);

  return (
    <div className="hidden overflow-hidden rounded-lg border bg-surface sm:block">
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-b text-left text-muted-foreground">
            {table.columns.map((c, i) => (
              <th
                key={c}
                scope="col"
                className={cn(
                  "px-2.5 py-2 font-normal",
                  i === 1 && "w-[76px]",
                  i === 2 && "w-[84px] text-right",
                )}
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name} className="border-b transition-colors last:border-0 hover:bg-subtle">
              <td className="truncate px-2.5 py-2">{r.name}</td>
              <td className="px-2.5 py-2">
                <span className="inline-flex items-center gap-1.5">
                  <span aria-hidden className={cn("size-1.5 rounded-full", STATUS_DOT[r.status])} />
                  {r.statusLabel}
                </span>
              </td>
              <td className="px-2.5 py-2 text-right font-mono">{r.amount}</td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={3} className="px-2.5 py-6 text-center text-muted-foreground">
                No results for “{query}”
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
