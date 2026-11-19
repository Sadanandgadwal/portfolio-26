"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import {
  FINE_POINTER_QUERY,
  useMediaQuery,
  usePrefersReducedMotion,
} from "@/hooks/use-media-query";

/** Elements opt in with data-cursor="view" | "interact" | "explore". */
const LABELS: Record<string, string> = { view: "View", interact: "Interact", explore: "Explore" };
const INTERACTIVE = "a, button, [role='button'], label, summary, [data-cursor='hover']";
const TEXT_ENTRY = "input, textarea, select, [contenteditable='true']";

type CursorState = { mode: "dot" | "link" | "label" | "hidden"; label?: string };

const SIZES = { dot: 10, link: 44, label: 84, hidden: 10 } as const;

/** Desktop-only cursor follower. Never rendered on touch devices or with reduced motion. */
export function CustomCursor() {
  const finePointer = useMediaQuery(FINE_POINTER_QUERY);
  const reduceMotion = usePrefersReducedMotion();
  const enabled = finePointer && !reduceMotion;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 600, damping: 40, mass: 0.35 });
  const springY = useSpring(y, { stiffness: 600, damping: 40, mass: 0.35 });

  const [state, setState] = useState<CursorState>({ mode: "hidden" });
  const [visible, setVisible] = useState(false);
  const stateKey = useRef("hidden:");

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const update = (next: CursorState) => {
      const key = `${next.mode}:${next.label ?? ""}`;
      if (key === stateKey.current) return;
      stateKey.current = key;
      setState(next);
    };

    const classify = (target: Element | null) => {
      if (!target?.closest) return;
      if (target.closest(TEXT_ENTRY)) return update({ mode: "hidden" });
      const labelled = target.closest<HTMLElement>("[data-cursor]");
      const interactive = target.closest(INTERACTIVE);
      const label = labelled && LABELS[labelled.dataset.cursor ?? ""];
      // A control nested inside a labelled region gets the precise ring, not the label disc.
      const nestedControl =
        interactive && labelled && interactive !== labelled && labelled.contains(interactive);
      if (label && !nestedControl) return update({ mode: "label", label });
      if (interactive) return update({ mode: "link" });
      update({ mode: "dot" });
    };

    let lastTarget: EventTarget | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      // Classify only when the hovered element changes (covers DOM changes under a still cursor).
      if (e.target !== lastTarget) {
        lastTarget = e.target;
        classify(e.target as Element | null);
      }
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = SIZES[state.mode];
  return (
    <motion.div
      aria-hidden
      data-testid="custom-cursor"
      data-mode={state.mode}
      className="pointer-events-none fixed top-0 left-0 z-100"
      style={{ x: springX, y: springY }}
    >
      <motion.div
        className={
          state.mode === "link"
            ? "-translate-1/2 rounded-full border border-foreground/50 bg-foreground/5 backdrop-blur-[1px]"
            : "grid -translate-1/2 place-items-center rounded-full bg-foreground font-mono text-[10px] tracking-[0.18em] text-background uppercase"
        }
        initial={false}
        animate={{
          width: size,
          height: size,
          opacity: visible && state.mode !== "hidden" ? 1 : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
      >
        {state.mode === "label" && state.label}
      </motion.div>
    </motion.div>
  );
}
