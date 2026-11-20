"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type State = "idle" | "copied" | "error";
const MESSAGES: Record<State, string> = {
  idle: "",
  copied: "Email address copied to clipboard.",
  error: "Couldn't copy automatically. Select the address to copy it.",
};

/** Copies the address with the Clipboard API; on failure the address stays selectable. */
export function CopyEmail({ email, label }: { email: string; label: string }) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard API unavailable");
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("error");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2500);
  };

  return (
    <div className="grid gap-2">
      <button
        type="button"
        onClick={copy}
        className="group/copy inline-flex w-fit max-w-full items-center gap-3 rounded-full border bg-surface py-2 pr-2 pl-4 text-left transition-colors hover:border-border-strong"
      >
        <span className="truncate font-mono text-sm select-all">{email}</span>
        <span
          className={cn(
            "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs transition-colors",
            state === "copied" ? "bg-foreground text-background" : "bg-subtle text-foreground",
          )}
        >
          {state === "copied" ? (
            <Check aria-hidden className="size-3.5" />
          ) : (
            <Copy aria-hidden className="size-3.5" />
          )}
          {state === "copied" ? "Copied" : label}
        </span>
      </button>
      <p role="status" className="min-h-5 text-sm text-muted-foreground">
        {MESSAGES[state]}
      </p>
    </div>
  );
}
