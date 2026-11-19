"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from "motion/react";
import { cn } from "@/lib/utils";

/** Vertical timeline whose line fills as the visitor scrolls through it. */
export function Timeline({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 55%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });

  return (
    <div className={cn("relative", className)}>
      <div aria-hidden className="absolute top-2 bottom-2 left-[7px] w-px bg-border" />
      <motion.div
        aria-hidden
        data-testid="timeline-progress"
        className="absolute top-2 bottom-2 left-[7px] w-px origin-top bg-foreground"
        style={{ scaleY: reduceMotion ? 1 : scaleY }}
      />
      <ol ref={ref} className="grid gap-16 md:gap-20">
        {children}
      </ol>
    </div>
  );
}

/**
 * Timeline item; its dot is active while the entry's top is above 55% of the viewport.
 * Position-based (not intersection-based), so it stays correct after anchor jumps or reloads.
 */
export function TimelineEntry({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLLIElement>(null);
  const [active, setActive] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 55%", "start 50%"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(v > 0));

  return (
    <li ref={ref} data-active={active || undefined} className="group/entry relative pl-10 md:pl-14">
      <span
        aria-hidden
        className="absolute top-1.5 left-0 grid size-[15px] place-items-center rounded-full border border-border-strong bg-background transition-[border-color,box-shadow] duration-500 group-data-active/entry:border-foreground group-data-active/entry:shadow-[0_0_0_4px_var(--background),0_0_0_5px_var(--border)]"
      >
        <span className="size-[7px] scale-0 rounded-full bg-foreground transition-transform duration-500 ease-out-expo group-data-active/entry:scale-100" />
      </span>
      {children}
    </li>
  );
}
