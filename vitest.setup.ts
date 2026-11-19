import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom lacks matchMedia. Tests can override `window.__prefersDark` per case.
declare global {
  interface Window {
    __prefersDark?: boolean;
  }
}
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: query.includes("dark") ? !!window.__prefersDark : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.__prefersDark = false;
  document.documentElement.className = "";
  document.documentElement.style.colorScheme = "";
});
