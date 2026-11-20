"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ShowcaseOrder } from "@/lib/content";
import { formatLong } from "@/lib/calendar";
import { nextSort, queryRows, type SortDirection } from "@/lib/data-table";
import { formatCurrency } from "@/lib/format";
import { TRANSITIONS, type OrderStatus } from "@/lib/showcase/orders";
import { cn } from "@/lib/utils";
import { OrderStatusLabel } from "./order-status";

type Key = keyof ShowcaseOrder;
const COLUMNS: { key: Key; label: string; className?: string }[] = [
  { key: "id", label: "Order" },
  { key: "customer", label: "Customer" },
  { key: "region", label: "Region", className: "hidden @3xl/app:table-cell" },
  { key: "date", label: "Date", className: "hidden @xl/app:table-cell" },
  { key: "total", label: "Total", className: "text-right" },
  { key: "status", label: "Status", className: "hidden @lg/app:table-cell" },
];
const ALL = "all";

type OrdersViewProps = {
  orders: ShowcaseOrder[];
  onStatusChange: (id: string, status: OrderStatus) => void;
};

export function OrdersView({ orders, onStatusChange }: OrdersViewProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(ALL);
  const [sort, setSort] = useState<{ key: Key; direction: SortDirection } | null>({
    key: "date",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");

  const result = useMemo(
    () =>
      queryRows(orders, {
        search,
        searchKeys: ["id", "customer", "region"],
        filter: { key: "status", value: status === ALL ? null : status },
        sort,
        page,
        pageSize: 6,
      }),
    [orders, search, status, sort, page],
  );
  const open = orders.find((o) => o.id === openId) ?? null;

  const act = (id: string, next: OrderStatus) => {
    onStatusChange(id, next);
    setNotice(`${id} marked as ${next}.`);
    setOpenId(null);
  };

  return (
    <div className="grid gap-3">
      <div className="flex flex-col gap-2 @xl/app:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search orders</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search order, customer, region…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </label>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger aria-label="Filter orders by status" className="w-full @xl/app:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            {(["paid", "pending", "shipped", "cancelled"] as const).map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-surface">
        <table className="w-full text-sm">
          <caption className="sr-only">Sample orders. Select an order to see details.</caption>
          <thead className="bg-subtle/60">
            <tr className="border-b text-left">
              {COLUMNS.map((c) => (
                <th
                  key={c.key}
                  scope="col"
                  aria-sort={
                    sort?.key === c.key
                      ? sort.direction === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  className={cn("px-3 py-2 font-medium", c.className)}
                >
                  <button
                    type="button"
                    onClick={() => setSort((s) => nextSort(s, c.key))}
                    className="-mx-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-muted-foreground hover:bg-subtle hover:text-foreground"
                  >
                    {c.label}
                    {sort?.key !== c.key ? (
                      <ArrowUpDown aria-hidden className="size-3 opacity-40" />
                    ) : sort.direction === "asc" ? (
                      <ArrowUp aria-hidden className="size-3" />
                    ) : (
                      <ArrowDown aria-hidden className="size-3" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-subtle/60">
                <td className="px-3 py-2.5">
                  <button
                    type="button"
                    onClick={() => setOpenId(o.id)}
                    className="font-mono text-xs underline-offset-4 hover:underline"
                  >
                    {o.id}
                  </button>
                </td>
                <td className="max-w-40 truncate px-3 py-2.5">{o.customer}</td>
                <td className="hidden px-3 py-2.5 @3xl/app:table-cell">{o.region}</td>
                <td className="hidden px-3 py-2.5 font-mono text-xs text-muted-foreground @xl/app:table-cell">
                  {o.date}
                </td>
                <td className="px-3 py-2.5 text-right tabular-nums">{formatCurrency(o.total)}</td>
                <td className="hidden px-3 py-2.5 @lg/app:table-cell">
                  <OrderStatusLabel status={o.status} />
                </td>
              </tr>
            ))}
            {result.total === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-3 py-10 text-center text-muted-foreground"
                >
                  No orders match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground" aria-live="polite" data-testid="orders-range">
          {notice ||
            (result.total === 0 ? "0 orders" : `${result.from}–${result.to} of ${result.total}`)}
        </p>
        <div className="flex items-center gap-1">
          <IconButton
            aria-label="Previous page"
            size="sm"
            variant="outline"
            disabled={result.page <= 1}
            onClick={() => setPage(result.page - 1)}
          >
            <ChevronLeft />
          </IconButton>
          <IconButton
            aria-label="Next page"
            size="sm"
            variant="outline"
            disabled={result.page >= result.pageCount}
            onClick={() => setPage(result.page + 1)}
          >
            <ChevronRight />
          </IconButton>
        </div>
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        {open && (
          <DialogContent>
            <DialogTitle>Order {open.id}</DialogTitle>
            <DialogDescription>Sample order. Changes are kept in this page only.</DialogDescription>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Customer", open.customer],
                ["Region", open.region],
                ["Date", formatLong(open.date)],
                ["Total", formatCurrency(open.total)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{v}</dd>
                </div>
              ))}
              <div>
                <dt className="text-xs text-muted-foreground">Status</dt>
                <dd>
                  <OrderStatusLabel status={open.status} />
                </dd>
              </div>
            </dl>
            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="ghost"
                disabled={!TRANSITIONS[open.status].cancel}
                onClick={() => act(open.id, "cancelled")}
              >
                Cancel order
              </Button>
              <Button
                disabled={!TRANSITIONS[open.status].ship}
                onClick={() => act(open.id, "shipped")}
              >
                Mark as shipped
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
