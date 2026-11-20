"use client";

import type { ReactNode } from "react";
import { MotionConfig } from "motion/react";

/**
 * Motion respects the OS reduced-motion setting at animation time: transform/layout animations
 * jump to their end state, opacity fades remain. Complements the hydration-safe hook used for markup.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
