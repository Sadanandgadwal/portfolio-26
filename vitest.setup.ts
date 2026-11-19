import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// jsdom lacks matchMedia. Tests can override `window.__prefersDark` per case.
declare global {
  interface Window {
    __prefersDark?: boolean;
    __reduceMotion?: boolean;
  }
}
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn((query: string) => ({
    matches: query.includes("dark")
      ? !!window.__prefersDark
      : query.includes("reduce")
        ? !!window.__reduceMotion
        : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// jsdom lacks IntersectionObserver and scrollIntoView.
class IntersectionObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
Element.prototype.scrollIntoView = vi.fn();

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.__prefersDark = false;
  window.__reduceMotion = false;
  document.documentElement.className = "";
  document.documentElement.style.colorScheme = "";
});
