"use client";

import { useState } from "react";
import {
  Bell,
  LayoutDashboard,
  Monitor,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Smartphone,
  Tablet,
  UserPlus,
} from "lucide-react";
import { BrowserFrame } from "@/components/ui/browser-frame";
import type { Showcase } from "@/lib/content";
import { addMonths } from "@/lib/calendar";
import { recentOrders, type OrderStatus } from "@/lib/showcase/orders";
import { cn } from "@/lib/utils";
import { CustomerFormView } from "./customer-form-view";
import { DashboardView } from "./dashboard-view";
import { OrdersView } from "./orders-view";

type View = "dashboard" | "orders" | "customer";
type Device = "desktop" | "tablet" | "mobile";

const VIEWS: { id: View; label: string; icon: typeof Package }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: Package },
  { id: "customer", label: "New customer", icon: UserPlus },
];
const DEVICES: { id: Device; label: string; icon: typeof Monitor; width: string }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor, width: "100%" },
  { id: "tablet", label: "Tablet", icon: Tablet, width: "768px" },
  { id: "mobile", label: "Mobile", icon: Smartphone, width: "390px" },
];

/** Sample ERP app. Its layout responds to its own width (container queries), driven by the device switcher. */
export function ShowcaseApp({ data }: { data: Showcase }) {
  const [view, setView] = useState<View>("dashboard");
  const [device, setDevice] = useState<Device>("desktop");
  const [collapsed, setCollapsed] = useState(false);
  const [orders, setOrders] = useState(data.orders);

  const latest = recentOrders(data.orders, 1)[0]?.date ?? "2026-01-01";
  const defaultMonth = `${addMonths(latest, 1).slice(0, 8)}01`;
  const updateStatus = (id: string, status: OrderStatus) =>
    setOrders((rows) => rows.map((r) => (r.id === id ? { ...r, status } : r)));

  /** compact: collapsed sidebar. narrow: top nav, where inactive items become icon-only in tight containers. */
  const navButton = (v: (typeof VIEWS)[number], compact: boolean, narrow = false) => (
    <button
      key={v.id}
      type="button"
      aria-current={view === v.id ? "page" : undefined}
      title={compact ? v.label : undefined}
      onClick={() => setView(v.id)}
      className={cn(
        "flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-2.5 text-sm transition-colors",
        view === v.id
          ? "bg-surface font-medium text-foreground shadow-xs"
          : "text-muted-foreground hover:bg-surface/60 hover:text-foreground",
      )}
    >
      <v.icon aria-hidden className="size-4 shrink-0" />
      <span className={cn(compact && "sr-only", narrow && view !== v.id && "@max-md/app:sr-only")}>
        {v.label}
      </span>
    </button>
  );

  return (
    <div className="grid gap-4">
      <div className="flex justify-end max-md:hidden">
        <div
          role="radiogroup"
          aria-label="Preview device width"
          className="flex gap-1 rounded-full border bg-surface p-1"
        >
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              role="radio"
              aria-checked={device === d.id}
              onClick={() => setDevice(d.id)}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs transition-colors",
                device === d.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <d.icon aria-hidden className="size-3.5" />
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mx-auto w-full transition-[max-width] duration-700 ease-out-expo"
        style={{ maxWidth: DEVICES.find((d) => d.id === device)!.width }}
        data-testid="showcase-viewport"
      >
        <BrowserFrame url={`app.example.com/${view}`}>
          <div className="@container/app" data-cursor="interact">
            <div className="flex h-[640px] bg-background">
              <nav
                aria-label={`${data.appName} navigation`}
                className={cn(
                  "hidden shrink-0 flex-col gap-1 border-r bg-subtle/50 p-3 transition-[width] duration-300 @3xl/app:flex",
                  collapsed ? "w-16" : "w-52",
                )}
              >
                <div className="mb-3 flex items-center gap-2 px-1.5">
                  <span aria-hidden className="size-5 shrink-0 rounded-md bg-foreground" />
                  <span className={cn("truncate text-sm font-semibold", collapsed && "sr-only")}>
                    {data.appName}
                  </span>
                </div>
                {VIEWS.map((v) => navButton(v, collapsed))}
                <button
                  type="button"
                  onClick={() => setCollapsed((c) => !c)}
                  aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                  className="mt-auto flex h-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface/60 hover:text-foreground"
                >
                  {collapsed ? (
                    <PanelLeftOpen aria-hidden className="size-4" />
                  ) : (
                    <PanelLeftClose aria-hidden className="size-4" />
                  )}
                </button>
              </nav>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center gap-2 border-b px-3 py-2 @3xl/app:px-5">
                  <nav
                    aria-label={`${data.appName} sections`}
                    className="-mx-1 flex gap-1 overflow-x-auto px-1 @3xl/app:hidden"
                  >
                    {VIEWS.map((v) => navButton(v, false, true))}
                  </nav>
                  <p className="hidden text-sm text-muted-foreground @3xl/app:block">
                    {data.appName} /{" "}
                    <span className="text-foreground">
                      {VIEWS.find((v) => v.id === view)!.label}
                    </span>
                  </p>
                  <span
                    className="ml-auto grid size-8 shrink-0 place-items-center rounded-full border text-muted-foreground"
                    aria-hidden
                  >
                    <Bell className="size-4" />
                  </span>
                </div>
                <div
                  className="flex-1 overflow-y-auto p-3 @3xl/app:p-5"
                  data-testid="showcase-content"
                >
                  {view === "dashboard" && (
                    <DashboardView orders={orders} onViewAll={() => setView("orders")} />
                  )}
                  {view === "orders" && (
                    <OrdersView orders={orders} onStatusChange={updateStatus} />
                  )}
                  {view === "customer" && (
                    <CustomerFormView countries={data.countries} defaultMonth={defaultMonth} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>
    </div>
  );
}
