import type { ShowcaseOrder } from "@/lib/content";

export type OrderStatus = ShowcaseOrder["status"];

export type OrderSummary = {
  revenue: number;
  orders: number;
  average: number;
  pending: number;
};

/** KPIs computed from the rows themselves so displayed totals always add up. Cancelled orders earn nothing. */
export function summarize(orders: ShowcaseOrder[]): OrderSummary {
  const billable = orders.filter((o) => o.status !== "cancelled");
  const revenue = billable.reduce((sum, o) => sum + o.total, 0);
  return {
    revenue,
    orders: orders.length,
    average: billable.length ? revenue / billable.length : 0,
    pending: orders.filter((o) => o.status === "pending").length,
  };
}

/** Billable revenue per region (sorted by name) — the dashboard chart, consistent with the KPIs. */
export function revenueByRegion(orders: ShowcaseOrder[]): { region: string; revenue: number }[] {
  const totals = new Map<string, number>();
  for (const o of orders) {
    totals.set(o.region, (totals.get(o.region) ?? 0) + (o.status === "cancelled" ? 0 : o.total));
  }
  return [...totals]
    .map(([region, revenue]) => ({ region, revenue }))
    .sort((a, b) => a.region.localeCompare(b.region));
}

/** Newest first (ISO dates sort lexically), then by id for stable ties. */
export function recentOrders(orders: ShowcaseOrder[], limit: number): ShowcaseOrder[] {
  return [...orders]
    .sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, limit);
}

/** Allowed status transitions for the order detail actions. */
export const TRANSITIONS: Record<OrderStatus, { ship: boolean; cancel: boolean }> = {
  pending: { ship: false, cancel: true },
  paid: { ship: true, cancel: true },
  shipped: { ship: false, cancel: false },
  cancelled: { ship: false, cancel: false },
};

export const STATUS_DOT: Record<OrderStatus, string> = {
  paid: "bg-foreground",
  pending: "bg-signal",
  shipped: "bg-border-strong",
  cancelled: "bg-destructive",
};
