"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import type { Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];
const TOKENS = [
  "background",
  "surface",
  "foreground",
  "muted-foreground",
  "border-strong",
  "signal",
];

/** Drives the real site theme; swatches read the live tokens. */
export function ThemeSpecimen() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid gap-5">
      <div
        role="radiogroup"
        aria-label="Site theme"
        className="grid grid-cols-2 gap-1 rounded-full border bg-subtle p-1"
      >
        {OPTIONS.map(({ value, label, icon: Icon }) => {
          const checked = theme === value;
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={checked}
              onClick={() => setTheme(value)}
              className={cn(
                "inline-flex h-9 items-center justify-center gap-2 rounded-full text-sm transition-[background-color,color,box-shadow] duration-300",
                checked
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </button>
          );
        })}
      </div>
      <ul className="grid grid-cols-3 gap-2">
        {TOKENS.map((t) => (
          <li key={t} className="overflow-hidden rounded-lg border">
            <div className="h-8 border-b" style={{ background: `var(--${t})` }} />
            <p className="truncate px-2 py-1 font-mono text-[10px] text-muted-foreground">{t}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
