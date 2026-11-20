import { describe, expect, it } from "vitest";
import { linePaths, nearestIndex, niceMax, toPoints } from "./chart";

describe("niceMax", () => {
  it.each([
    [0, 1],
    [0.7, 0.8],
    [87, 100],
    [110, 120],
    [130, 150],
    [240, 250],
    [4200, 5000],
    [6100, 8000],
    [0.035, 0.04],
  ])("%s → %s", (v, expected) => expect(niceMax(v)).toBe(expected));
});

describe("toPoints / linePaths", () => {
  it("spreads points across the width and scales y downward", () => {
    const pts = toPoints([0, 50, 100], 200, 100, 100);
    expect(pts).toEqual([
      { x: 0, y: 100 },
      { x: 100, y: 50 },
      { x: 200, y: 0 },
    ]);
    const { line, area } = linePaths(pts, 100);
    expect(line).toBe("M0.00,100.00 L100.00,50.00 L200.00,0.00");
    expect(area.endsWith("L200.00,100 L0.00,100 Z")).toBe(true);
  });

  it("handles single and empty series", () => {
    expect(toPoints([5], 100, 10, 10)).toEqual([{ x: 0, y: 5 }]);
    expect(linePaths([], 10)).toEqual({ line: "", area: "" });
  });
});

describe("nearestIndex", () => {
  it("snaps to the closest point and clamps", () => {
    expect(nearestIndex(0, 300, 4)).toBe(0);
    expect(nearestIndex(160, 300, 4)).toBe(2);
    expect(nearestIndex(999, 300, 4)).toBe(3);
    expect(nearestIndex(-5, 300, 4)).toBe(0);
    expect(nearestIndex(50, 300, 1)).toBe(0);
  });
});
