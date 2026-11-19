"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";
import { FINE_POINTER_QUERY, useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const SPRING = { stiffness: 220, damping: 16, mass: 0.4 };

type MagneticProps = {
  children: ReactNode;
  /** Fraction of the cursor offset applied (0–1). */
  strength?: number;
  className?: string;
};

/** Pulls its child subtly toward the cursor. Inert on touch devices and with reduced motion. */
export function Magnetic({ children, strength = 0.3, className }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const enabled = finePointer && !useReducedMotion();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      style={enabled ? { x, y } : undefined}
      onPointerMove={enabled ? onPointerMove : undefined}
      onPointerLeave={enabled ? reset : undefined}
    >
      {children}
    </motion.div>
  );
}
