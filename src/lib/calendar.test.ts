import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonths,
  formatLong,
  isWeekend,
  monthGrid,
  monthLabel,
  parseISO,
  sameMonth,
} from "./calendar";

describe("parseISO", () => {
  it("accepts real dates and rejects impossible ones", () => {
    expect(parseISO("2026-02-28")).not.toBeNull();
    expect(parseISO("2026-02-30")).toBeNull();
    expect(parseISO("2026-2-3")).toBeNull();
    expect(parseISO("")).toBeNull();
  });
});

describe("date arithmetic", () => {
  it("adds days across month/year boundaries", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
  it("adds months, clamping the day", () => {
    expect(addMonths("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonths("2028-01-31", 1)).toBe("2028-02-29");
    expect(addMonths("2026-01-15", -1)).toBe("2025-12-15");
  });
});

describe("monthGrid", () => {
  it("is a Monday-first 6×7 grid containing the whole month", () => {
    const grid = monthGrid("2026-11-19"); // Nov 1 2026 is a Sunday
    expect(grid).toHaveLength(6);
    expect(grid.every((w) => w.length === 7)).toBe(true);
    expect(grid[0][0]).toBe("2026-10-26");
    expect(grid[0][6]).toBe("2026-11-01");
    expect(grid.flat()).toContain("2026-11-30");
  });
});

describe("misc", () => {
  it("weekend, same month, labels", () => {
    expect(isWeekend("2026-11-21")).toBe(true); // Saturday
    expect(isWeekend("2026-11-19")).toBe(false);
    expect(sameMonth("2026-11-01", "2026-11-30")).toBe(true);
    expect(sameMonth("2026-11-30", "2026-12-01")).toBe(false);
    expect(monthLabel("2026-11-19")).toBe("November 2026");
    expect(formatLong("2026-11-19")).toBe("Thu, 19 Nov 2026");
    expect(formatLong("bad")).toBe("");
  });
});
