"use client";

import { useState, type PointerEvent } from "react";
import { Check } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CardsSpecimen() {
  const [selected, setSelected] = useState(false);

  const trackSpotlight = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div className="grid gap-3">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Basic</CardTitle>
          <CardDescription>Surface and hairline border, no motion.</CardDescription>
        </CardHeader>
      </Card>

      <Card size="sm" interactive className={cn(selected && "border-foreground/40")}>
        <CardHeader>
          <CardTitle>
            <button
              type="button"
              aria-pressed={selected}
              onClick={() => setSelected((s) => !s)}
              className="flex w-full items-center justify-between text-left after:absolute after:inset-0"
            >
              Interactive
              <span
                aria-hidden
                className={cn(
                  "grid size-5 place-items-center rounded-full border transition-colors",
                  selected && "border-foreground bg-foreground text-background",
                )}
              >
                {selected && <Check className="size-3" />}
              </span>
            </button>
          </CardTitle>
          <CardDescription>
            {selected ? "Selected. Click to clear." : "Lifts on hover; click to select."}
          </CardDescription>
        </CardHeader>
      </Card>

      <div
        onPointerMove={trackSpotlight}
        className="group/spot relative overflow-hidden rounded-xl border bg-card p-4 [--x:50%] [--y:50%]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(180px_circle_at_var(--x)_var(--y),color-mix(in_oklch,var(--foreground)_10%,transparent),transparent)] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        />
        <p className="relative font-medium tracking-tight">Hover</p>
        <p className="relative mt-1 text-sm text-muted-foreground">
          A spotlight follows the pointer.
        </p>
      </div>
    </div>
  );
}
