"use client";

import { useCallback, useSyncExternalStore } from "react";
import { DARK_QUERY, THEME_STORAGE_KEY, isTheme, type Theme } from "@/lib/theme";

const TRANSITION_CLASS = "theme-transition";
const TRANSITION_MS = 350;

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  const update = () => {
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!animate || reduceMotion) return update();

  if (typeof document.startViewTransition === "function") {
    document.startViewTransition(update);
    return;
  }
  // Fallback: short color cross-fade on every element.
  root.classList.add(TRANSITION_CLASS);
  update();
  window.setTimeout(() => root.classList.remove(TRANSITION_CLASS), TRANSITION_MS);
}

function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

/** Unknown on the server; the DOM (set by the init script) is the source of truth on the client. */
function getServerSnapshot(): Theme | null {
  return null;
}

function subscribe(onChange: () => void) {
  const root = document.documentElement;
  const observer = new MutationObserver(onChange);
  observer.observe(root, { attributes: true, attributeFilter: ["class"] });

  // Follow OS changes only while the user hasn't chosen explicitly.
  const media = window.matchMedia(DARK_QUERY);
  const onSystem = (e: MediaQueryListEvent) => {
    if (!readStored()) applyTheme(e.matches ? "dark" : "light", true);
  };
  // Sync across tabs.
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      applyTheme(isTheme(e.newValue) ? e.newValue : media.matches ? "dark" : "light", false);
    }
  };

  media.addEventListener("change", onSystem);
  window.addEventListener("storage", onStorage);
  return () => {
    observer.disconnect();
    media.removeEventListener("change", onSystem);
    window.removeEventListener("storage", onStorage);
  };
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setTheme = useCallback((next: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode): theme still applies for this page view.
    }
    applyTheme(next, true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(getSnapshot() === "dark" ? "light" : "dark");
  }, [setTheme]);

  return { theme, setTheme, toggleTheme };
}
