"use client";

import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShowcaseOrder } from "@/lib/content";
import { formatCurrency } from "@/lib/format";
import { recentOrders, revenueByRegion, summarize } from "@/lib/showcase/orders";
import { cn } from "@/lib/utils";
import { OrderStatusLabel } from "./order-status";

type DashboardViewProps = {
  orders: ShowcaseOrder[];
  onViewAll: () => void;
};

const ALL = "All";

export function DashboardView({ orders, onViewAll }: DashboardViewProps) {
  const regions = useMemo(
    () => [ALL, ...Array.from(new Set(orders.map((o) => o.region))).sort()],
    [orders],
  );
  const [region, setRegion] = useState(ALL);
  const [hovered, setHovered] = useState<number | null>(null);

  const scoped = region === ALL ? orders : orders.filter((o) => o.region === region);
  const s = summarize(scoped);
  const kpis = [
    { label: "Revenue", value: formatCurrency(s.revenue) },
    { label: "Orders", value: String(s.orders) },
    { label: "Avg. order", value: formatCurrency(s.average) },
    { label: "Pending", value: String(s.pending) },
  ];
  const bars = revenueByRegion(orders);
  const max = Math.max(...bars.map((b) => b.revenue), 1);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-tight">Overview</h3>
        <div
          role="radiogroup"
          aria-label="Region"
          className="flex flex-wrap gap-1 rounded-full border bg-subtle p-1"
        >
          {regions.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={r === region}
              onClick={() => setRegion(r)}
              className={cn(
                "h-7 rounded-full px-3 text-xs transition-colors",
                r === region
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-3 @2xl/app:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border bg-surface p-4">
            <dt className="text-xs text-muted-foreground">{k.label}</dt>
            <dd
              className="mt-1 text-xl font-semibold tracking-tight tabular-nums"
              data-testid={`kpi-${k.label}`}
            >
              {k.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-3 @4xl/app:grid-cols-[1.1fr_1fr]">
        <figure className="rounded-xl border bg-surface p-4">
          <figcaption className="text-sm text-muted-foreground">Revenue by region</figcaption>
          <div className="mt-4 flex h-40 items-end gap-2" onPointerLeave={() => setHovered(null)}>
            {bars.map((b, i) => {
              const emphasised =
                hovered === null ? region === ALL || region === b.region : hovered === i;
              return (
                <button
                  key={b.region}
                  type="button"
                  aria-label={`${b.region}: ${formatCurrency(b.revenue)}`}
                  aria-pressed={region === b.region}
                  onClick={() => setRegion(region === b.region ? ALL : b.region)}
                  onPointerEnter={() => setHovered(i)}
                  onFocus={() => setHovered(i)}
                  onBlur={() => setHovered(null)}
                  className="relative flex h-full flex-1 flex-col items-center justify-end gap-1.5"
                >
                  {hovered === i && (
                    <span className="absolute -top-1 rounded bg-foreground px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-background">
                      {formatCurrency(b.revenue)}
                    </span>
                  )}
                  <span
                    className={cn(
                      "w-full rounded-md transition-colors",
                      emphasised ? "bg-foreground" : "bg-border-strong",
                    )}
                    style={{ height: `${(b.revenue / max) * 80}%` }}
                  />
                  <span className="font-mono text-[10px] text-muted-foreground">{b.region}</span>
                </button>
              );
            })}
          </div>
        </figure>

        <section aria-labelledby="recent-orders" className="rounded-xl border bg-surface">
          <div className="flex items-center justify-between px-4 pt-4">
            <h4 id="recent-orders" className="text-sm text-muted-foreground">
              Recent orders
            </h4>
            <Button variant="link" size="sm" onClick={onViewAll} className="text-xs">
              View all <ArrowRight aria-hidden className="size-3.5" />
            </Button>
          </div>
          <ul className="mt-2">
            {recentOrders(scoped, 5).map((o) => (
              <li
                key={o.id}
                className="flex items-center justify-between gap-3 border-t px-4 py-2.5 text-sm"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{o.customer}</span>
                  <span className="font-mono text-xs text-muted-foreground">{o.id}</span>
                </span>
                <span className="grid justify-items-end gap-0.5">
                  <span className="tabular-nums">{formatCurrency(o.total)}</span>
                  <span className="text-xs">
                    <OrderStatusLabel status={o.status} />
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
