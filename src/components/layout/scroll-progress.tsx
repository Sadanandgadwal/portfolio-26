"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { scrollToTop } from "@/lib/scroll";

/** Floating scroll-to-top whose ring shows reading progress. Appears after the first viewport. */
export function ScrollProgress() {
  const reduceMotion = usePrefersReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > window.innerHeight * 0.9));

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          data-testid="scroll-progress"
          onClick={() => scrollToTop(reduceMotion)}
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 8 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="group/progress fixed right-4 bottom-4 z-40 grid size-12 place-items-center rounded-full border bg-surface-raised/90 shadow-md backdrop-blur md:right-6 md:bottom-6"
        >
          <svg viewBox="0 0 48 48" aria-hidden className="absolute inset-0 size-full -rotate-90">
            <circle cx="24" cy="24" r="22" fill="none" className="stroke-border" strokeWidth="2" />
            <motion.circle
              cx="24"
              cy="24"
              r="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          <ArrowUp
            aria-hidden
            className="size-4 transition-transform duration-300 ease-out-expo group-hover/progress:-translate-y-0.5"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
