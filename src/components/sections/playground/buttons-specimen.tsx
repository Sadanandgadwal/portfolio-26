"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

type Phase = "idle" | "loading" | "done";
const LABELS: Record<Phase, string> = { idle: "Deploy", loading: "Deploying…", done: "Deployed" };

export function ButtonsSpecimen() {
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const run = () => {
    setPhase("loading");
    timers.current.push(
      window.setTimeout(() => setPhase("done"), 1400),
      window.setTimeout(() => setPhase("idle"), 3200),
    );
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={phase === "done" ? "secondary" : "default"}
          loading={phase === "loading"}
          onClick={phase === "idle" ? run : undefined}
          aria-disabled={phase === "done" || undefined}
          data-testid="deploy-button"
        >
          {phase === "done" && <Check aria-hidden />}
          {LABELS[phase]}
          {phase === "idle" && <ArrowRight aria-hidden data-icon="inline-end" />}
        </Button>
        <Button disabled>Disabled</Button>
        <p role="status" className="sr-only">
          {phase === "loading" ? "Deploying" : phase === "done" ? "Deployed successfully" : ""}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        Loading sets <code className="font-mono text-xs">aria-busy</code> and blocks repeat clicks;
        status changes are announced to screen readers.
      </p>
    </div>
  );
}
