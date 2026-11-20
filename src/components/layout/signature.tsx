"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

/** The name traced as an outline, then filled, the first time it scrolls into view. Decorative. */
export function Signature({ name }: { name: string }) {
  const ref = useRef<SVGSVGElement>(null);
  const drawn = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const width = Math.max(320, name.length * 66);

  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox={`0 0 ${width} 130`}
      className={cn("signature w-full max-w-4xl overflow-visible", drawn && "is-drawn")}
      data-testid="signature"
    >
      <text x="0" y="105" className="font-heading text-[118px] font-semibold tracking-[-0.045em]">
        {name}
      </text>
    </svg>
  );
}
