"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Desktop-class pointer: enables cursor, magnetic and parallax effects. */
export const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";

/** SSR-safe media query (false on the server and during hydration). */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Hydration-safe reduced-motion preference. Unlike motion's `useReducedMotion`, the first client
 * render matches the server (false), so preference-dependent markup never causes a hydration
 * mismatch; it updates right after hydration.
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery(REDUCED_MOTION_QUERY);
}
