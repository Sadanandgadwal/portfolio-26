import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BrowserFrameProps = {
  url: string;
  children: ReactNode;
  className?: string;
};

/** Browser-window chrome used by the project and showcase mockups. */
export function BrowserFrame({ url, children, className }: BrowserFrameProps) {
  return (
    <div className={cn("overflow-hidden rounded-xl border bg-surface shadow-lg", className)}>
      <div className="flex h-9 items-center gap-3 border-b bg-subtle/60 px-3">
        <div className="flex w-12 gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="size-2.5 rounded-full bg-border-strong" />
          ))}
        </div>
        <div className="mx-auto flex h-5 w-full max-w-64 items-center justify-center truncate rounded-md bg-background px-3 font-mono text-[10px] text-muted-foreground">
          {url}
        </div>
        <div className="w-12" aria-hidden />
      </div>
      {children}
    </div>
  );
}
