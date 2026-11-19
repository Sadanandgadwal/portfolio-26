"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

type AnimatedNumberProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
};

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/**
 * Counts up from 0 the first time it scrolls into view. Server HTML contains the final value
 * (correct without JS / for crawlers); reduced motion keeps it static.
 */
export function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  durationMs = 1600,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduceMotion = useReducedMotion();
  const decimals = Number.isInteger(value) ? 0 : (String(value).split(".")[1]?.length ?? 0);
  const final = `${prefix}${format(value, decimals)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: durationMs / 1000,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${prefix}${format(v, decimals)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, prefix, suffix, decimals, durationMs]);

  return (
    <span className={className}>
      <span ref={ref} aria-hidden className="tabular-nums">
        {final}
      </span>
      <span className="sr-only">{final}</span>
    </span>
  );
}
