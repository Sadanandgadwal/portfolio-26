import { describe, expect, it } from "vitest";
import { THEME_STORAGE_KEY, resolveTheme, themeInitScript } from "./theme";

const runInitScript = () => new Function(themeInitScript)();
const root = () => document.documentElement;

describe("resolveTheme", () => {
  it.each([
    ["dark", false, "dark"],
    ["light", true, "light"],
    [null, true, "dark"],
    [null, false, "light"],
    ["garbage", true, "dark"],
  ] as const)("stored=%s prefersDark=%s → %s", (stored, prefersDark, expected) => {
    expect(resolveTheme(stored, prefersDark)).toBe(expected);
  });
});

describe("themeInitScript (no-flash)", () => {
  it("follows the OS when nothing is stored", () => {
    window.__prefersDark = true;
    runInitScript();
    expect(root()).toHaveClass("dark");
    expect(root().style.colorScheme).toBe("dark");
  });

  it("stored preference overrides the OS", () => {
    window.__prefersDark = true;
    localStorage.setItem(THEME_STORAGE_KEY, "light");
    runInitScript();
    expect(root()).not.toHaveClass("dark");
    expect(root().style.colorScheme).toBe("light");
  });

  it("never throws when storage is unavailable", () => {
    const original = Storage.prototype.getItem;
    Storage.prototype.getItem = () => {
      throw new Error("SecurityError");
    };
    expect(runInitScript).not.toThrow();
    Storage.prototype.getItem = original;
  });
});
