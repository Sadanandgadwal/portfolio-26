"use client";

import { useCallback, useSyncExternalStore } from "react";

/** True once the page is scrolled past `threshold` px. Re-renders only when the boolean flips. */
export function useScrolled(threshold = 24): boolean {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("scroll", onChange, { passive: true });
    return () => window.removeEventListener("scroll", onChange);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}
