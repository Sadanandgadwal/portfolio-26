import { describe, expect, it } from "vitest";
import type { ShowcaseOrder } from "@/lib/content";
import { TRANSITIONS, recentOrders, revenueByRegion, summarize } from "./orders";

const o = (
  id: string,
  date: string,
  total: number,
  status: ShowcaseOrder["status"],
): ShowcaseOrder => ({
  id,
  customer: "C",
  region: "North",
  date,
  total,
  status,
});

describe("summarize", () => {
  it("excludes cancelled orders from revenue and average", () => {
    const s = summarize([
      o("1", "2026-01-01", 100, "paid"),
      o("2", "2026-01-02", 50, "cancelled"),
      o("3", "2026-01-03", 200, "pending"),
    ]);
    expect(s).toEqual({ revenue: 300, orders: 3, average: 150, pending: 1 });
  });
  it("handles an empty list", () => {
    expect(summarize([])).toEqual({ revenue: 0, orders: 0, average: 0, pending: 0 });
  });
});

describe("recentOrders", () => {
  it("sorts newest first with stable id tie-break, without mutating", () => {
    const rows = [
      o("A1", "2026-01-01", 1, "paid"),
      o("A3", "2026-02-01", 1, "paid"),
      o("A2", "2026-02-01", 1, "paid"),
    ];
    expect(recentOrders(rows, 2).map((r) => r.id)).toEqual(["A3", "A2"]);
    expect(rows[0].id).toBe("A1");
  });
});

describe("TRANSITIONS", () => {
  it("only paid orders can ship; shipped/cancelled are final", () => {
    expect(TRANSITIONS.paid.ship).toBe(true);
    expect(TRANSITIONS.pending.ship).toBe(false);
    expect(TRANSITIONS.shipped).toEqual({ ship: false, cancel: false });
    expect(TRANSITIONS.cancelled).toEqual({ ship: false, cancel: false });
  });
});

describe("revenueByRegion", () => {
  it("sums billable revenue per region and matches the summary total", () => {
    const rows = [
      { ...o("1", "2026-01-01", 100, "paid"), region: "West" },
      { ...o("2", "2026-01-01", 40, "cancelled"), region: "West" },
      { ...o("3", "2026-01-01", 60, "pending"), region: "East" },
    ];
    const byRegion = revenueByRegion(rows);
    expect(byRegion).toEqual([
      { region: "East", revenue: 60 },
      { region: "West", revenue: 100 },
    ]);
    expect(byRegion.reduce((a, r) => a + r.revenue, 0)).toBe(summarize(rows).revenue);
  });
});
