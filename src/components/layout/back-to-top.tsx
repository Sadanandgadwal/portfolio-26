"use client";

import { ArrowUp } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { scrollToTop } from "@/lib/scroll";

export function BackToTop() {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <button
      type="button"
      onClick={() => scrollToTop(reduceMotion)}
      className="group/top inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      Back to top
      <span className="grid size-8 place-items-center rounded-full border transition-colors group-hover/top:border-border-strong">
        <ArrowUp
          aria-hidden
          className="size-4 transition-transform duration-300 ease-out-expo group-hover/top:-translate-y-0.5"
        />
      </span>
    </button>
  );
}
