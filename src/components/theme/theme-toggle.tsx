"use client";

import { useId } from "react";
import { IconButton } from "@/components/ui/icon-button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const RAYS = [0, 45, 90, 135, 180, 225, 270, 315];

type ThemeToggleProps = { className?: string; size?: "default" | "sm" };

/**
 * Sun → moon morph. Visual state is driven purely by the `.dark` class on <html> (CSS),
 * so it is correct before hydration; only the label depends on JS state.
 */
export function ThemeToggle({ className, size = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const maskId = `theme-mask-${useId().replace(/[^\w-]/g, "")}`;
  const label = theme ? `Switch to ${theme === "dark" ? "light" : "dark"} theme` : "Toggle theme";

  return (
    <IconButton
      aria-label={label}
      title={label}
      size={size}
      onClick={toggleTheme}
      className={cn("group/theme", className)}
      data-testid="theme-toggle"
    >
      <svg viewBox="0 0 24 24" aria-hidden className="size-5 overflow-visible">
        <mask id={maskId}>
          <rect width="24" height="24" fill="white" />
          <circle
            cx="12"
            cy="4"
            r="7"
            fill="black"
            className="translate-x-[14px] -translate-y-[6px] transition-transform duration-500 ease-out-expo dark:translate-x-[5px] dark:translate-y-0"
          />
        </mask>
        <circle
          cx="12"
          cy="12"
          r="5"
          fill="currentColor"
          mask={`url(#${maskId})`}
          className="origin-center transition-transform duration-500 ease-out-expo [transform-box:fill-box] dark:scale-[1.6]"
        />
        <g
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="origin-center transition-[transform,opacity] duration-500 ease-out-expo [transform-box:fill-box] group-hover/theme:rotate-45 dark:scale-50 dark:-rotate-90 dark:opacity-0"
        >
          {RAYS.map((deg) => (
            <line key={deg} x1="12" y1="2.5" x2="12" y2="4" transform={`rotate(${deg} 12 12)`} />
          ))}
        </g>
      </svg>
    </IconButton>
  );
}
