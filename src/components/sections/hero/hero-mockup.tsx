"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Check, Search } from "lucide-react";
import { BrowserFrame } from "@/components/ui/browser-frame";
import { FINE_POINTER_QUERY, useMediaQuery } from "@/hooks/use-media-query";
import type { HeroMockup as HeroMockupData } from "@/lib/content";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 90, damping: 18, mass: 0.6 };
const STATUS_DOT = {
  success: "bg-foreground",
  pending: "bg-signal",
  neutral: "bg-border-strong",
} as const;

/** Pointer position normalised to -1…1 across the viewport, smoothed. Static when disabled. */
function usePointerParallax(enabled: boolean) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  useEffect(() => {
    if (!enabled) {
      x.set(0);
      y.set(0);
      return;
    }
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, x, y]);
  return { x: useSpring(x, SPRING), y: useSpring(y, SPRING) };
}

function useDepth(v: MotionValue<number>, depth: number) {
  return useTransform(v, [-1, 1], [-depth, depth]);
}

export function HeroMockup({ data, className }: { data: HeroMockupData; className?: string }) {
  const reduceMotion = useReducedMotion();
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const pointer = usePointerParallax(finePointer && !reduceMotion);

  const rotateY = useTransform(pointer.x, [-1, 1], [-7, 7]);
  const rotateX = useTransform(pointer.y, [-1, 1], [6, -6]);
  const modalX = useDepth(pointer.x, 22);
  const modalY = useDepth(pointer.y, 16);
  const badgeX = useDepth(pointer.x, -14);
  const badgeY = useDepth(pointer.y, -10);

  const [activeNav, setActiveNav] = useState(0);
  const [query, setQuery] = useState("");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(true);
  const [toast, setToast] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? data.table.rows.filter((r) => r.name.toLowerCase().includes(q)) : data.table.rows;
  }, [data.table.rows, query]);

  const maxPoint = Math.max(...data.chart.points.map((p) => p.value), 1);

  const confirm = () => {
    setModalOpen(false);
    setToast(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 2600);
  };

  return (
    <div
      data-cursor="interact"
      role="group"
      aria-label={`Interactive demo interface (${data.sampleLabel.toLowerCase()})`}
      className={cn("relative perspective-[1800px]", className)}
    >
      <motion.div style={{ rotateX, rotateY }} className="transform-3d">
        <BrowserFrame url={data.url} className="text-[11px] leading-tight">
          <div className="grid min-h-[340px] grid-cols-1 sm:grid-cols-[148px_1fr] lg:min-h-[400px]">
            {/* Sidebar */}
            <aside className="hidden border-r bg-subtle/40 p-3 sm:block">
              <div className="mb-4 flex items-center gap-2 px-1 font-medium">
                <span className="size-4 rounded-md bg-foreground" aria-hidden />
                {data.appName}
              </div>
              <ul className="grid gap-0.5">
                {data.navItems.map((item, i) => (
                  <li key={item}>
                    <button
                      type="button"
                      onClick={() => setActiveNav(i)}
                      aria-pressed={activeNav === i}
                      className={cn(
                        "w-full rounded-md px-2 py-1.5 text-left transition-colors",
                        activeNav === i
                          ? "bg-surface font-medium text-foreground shadow-xs"
                          : "text-muted-foreground hover:bg-surface/60 hover:text-foreground",
                      )}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Main */}
            <div className="flex min-w-0 flex-col gap-3 p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <p className="mr-auto text-sm font-semibold tracking-tight">
                  {data.navItems[activeNav] ?? data.title}
                </p>
                <label className="relative hidden items-center sm:flex">
                  <span className="sr-only">{data.searchPlaceholder}</span>
                  <Search
                    aria-hidden
                    className="pointer-events-none absolute left-2 size-3 text-muted-foreground"
                  />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={data.searchPlaceholder}
                    className="h-7 w-36 rounded-md border bg-background pr-2 pl-6 outline-none placeholder:text-muted-foreground focus-visible:border-foreground/40 lg:w-44"
                  />
                </label>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="h-7 rounded-md bg-foreground px-2.5 font-medium text-background transition-opacity hover:opacity-85"
                >
                  {data.primaryAction}
                </button>
              </div>

              <ul className="grid grid-cols-3 gap-2">
                {data.stats.map((s) => (
                  <li
                    key={s.label}
                    className="rounded-lg border bg-surface p-2.5 transition-colors hover:border-border-strong"
                  >
                    <p className="text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-base font-semibold tracking-tight">{s.value}</p>
                    {s.delta && (
                      <p
                        className={cn(
                          "mt-0.5 font-mono text-[10px]",
                          s.delta.startsWith("-") ? "text-muted-foreground" : "text-foreground",
                        )}
                      >
                        {s.delta}
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              <div className="grid flex-1 gap-2 lg:grid-cols-[1fr_1.15fr]">
                {/* Chart */}
                <figure className="flex flex-col rounded-lg border bg-surface p-2.5">
                  <figcaption className="text-muted-foreground">{data.chart.title}</figcaption>
                  <div
                    className="relative mt-2 flex h-28 flex-1 items-end gap-1.5"
                    onPointerLeave={() => setHoveredBar(null)}
                  >
                    {data.chart.points.map((p, i) => (
                      <button
                        key={p.label}
                        type="button"
                        aria-label={`${p.label}: ${p.value}`}
                        onPointerEnter={() => setHoveredBar(i)}
                        onFocus={() => setHoveredBar(i)}
                        onBlur={() => setHoveredBar(null)}
                        className="group/bar relative flex h-full flex-1 flex-col items-center justify-end gap-1"
                      >
                        <AnimatePresence>
                          {hoveredBar === i && (
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
                            hoveredBar === null || hoveredBar === i
                              ? "bg-foreground"
                              : "bg-border-strong",
                          )}
                          style={{ height: `${(p.value / maxPoint) * 78}%` }}
                          initial={reduceMotion ? false : { scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.9 + i * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        />
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {p.label[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </figure>

                {/* Table */}
                <div className="hidden overflow-hidden rounded-lg border bg-surface sm:block">
                  <table className="w-full table-fixed">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        {data.table.columns.map((c, i) => (
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
                        <tr
                          key={r.name}
                          className="border-b transition-colors last:border-0 hover:bg-subtle"
                        >
                          <td className="truncate px-2.5 py-2">{r.name}</td>
                          <td className="px-2.5 py-2">
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                aria-hidden
                                className={cn("size-1.5 rounded-full", STATUS_DOT[r.status])}
                              />
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
              </div>
            </div>
          </div>
        </BrowserFrame>
      </motion.div>

      {/* Floating layers (parallax depth) */}
      <motion.div style={{ x: badgeX, y: badgeY }} className="absolute -top-3 right-4 sm:right-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border bg-surface-raised px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase shadow-sm">
          <span aria-hidden className="size-1.5 rounded-full bg-signal" />
          {data.sampleLabel}
        </span>
      </motion.div>

      <motion.div
        style={{ x: modalX, y: modalY }}
        className="absolute -right-4 -bottom-10 hidden w-60 sm:block lg:-right-8"
      >
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              key="modal"
              role="group"
              aria-label={data.modal.title}
              initial={{ opacity: 0, scale: 0.94, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 6 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-xl border bg-surface-raised p-3.5 text-[11px] shadow-lg"
            >
              <p className="text-xs font-semibold">{data.modal.title}</p>
              <p className="mt-1 text-muted-foreground">{data.modal.description}</p>
              <p className="mt-3 text-muted-foreground">{data.modal.fieldLabel}</p>
              <div className="mt-1 flex h-7 items-center rounded-md border bg-background px-2">
                {data.modal.fieldValue}
                <span aria-hidden className="ml-px h-3.5 w-px animate-blink bg-foreground" />
              </div>
              <div className="mt-3 flex justify-end gap-1.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="h-7 rounded-md px-2.5 transition-colors hover:bg-subtle"
                >
                  {data.modal.cancel}
                </button>
                <button
                  type="button"
                  onClick={confirm}
                  className="h-7 rounded-md bg-foreground px-2.5 font-medium text-background transition-opacity hover:opacity-85"
                >
                  {data.modal.confirm}
                </button>
              </div>
            </motion.div>
          )}
          {toast && (
            <motion.div
              key="toast"
              role="status"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex items-center gap-2 rounded-full border bg-surface-raised px-3 py-2 text-[11px] shadow-md"
            >
              <Check aria-hidden className="size-3.5" />
              {data.modal.title} · {data.modal.fieldValue}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
