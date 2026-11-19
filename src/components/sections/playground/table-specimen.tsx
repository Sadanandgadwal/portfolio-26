"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PlaygroundRow } from "@/lib/content";
import { nextSort, queryRows, type SortDirection } from "@/lib/data-table";
import { cn } from "@/lib/utils";

type Key = keyof PlaygroundRow;
const COLUMNS: { key: Key; label: string; className?: string }[] = [
  { key: "name", label: "Name" },
  { key: "team", label: "Team", className: "max-sm:hidden" },
  { key: "status", label: "Status" },
  { key: "lastActive", label: "Last active", className: "max-md:hidden" },
];
const STATUS_DOT: Record<PlaygroundRow["status"], string> = {
  active: "bg-foreground",
  invited: "bg-signal",
  suspended: "bg-border-strong",
};
const ALL = "all";
const PAGE_SIZE = 5;

export function TableSpecimen({ rows }: { rows: PlaygroundRow[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>(ALL);
  const [sort, setSort] = useState<{ key: Key; direction: SortDirection } | null>(null);
  const [page, setPage] = useState(1);

  const result = useMemo(
    () =>
      queryRows(rows, {
        search,
        searchKeys: ["name", "email", "team"],
        filter: { key: "status", value: status === ALL ? null : status },
        sort,
        page,
        pageSize: PAGE_SIZE,
      }),
    [rows, search, status, sort, page],
  );

  const sortIcon = (key: Key) => {
    if (sort?.key !== key) return <ArrowUpDown aria-hidden className="size-3.5 opacity-40" />;
    return sort.direction === "asc" ? (
      <ArrowUp aria-hidden className="size-3.5" />
    ) : (
      <ArrowDown aria-hidden className="size-3.5" />
    );
  };

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Search members</span>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            type="search"
            placeholder="Search name, email or team…"
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
          <SelectTrigger aria-label="Filter by status" className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="invited">Invited</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <caption className="sr-only">Sample team members, sortable by column</caption>
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
                    className="-mx-1.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-muted-foreground transition-colors hover:bg-subtle hover:text-foreground"
                  >
                    {c.label}
                    {sortIcon(c.key)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.rows.map((r) => (
              <tr
                key={r.id}
                className="border-b transition-colors last:border-0 hover:bg-subtle/60"
              >
                <td className="px-3 py-2.5">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.email}</p>
                </td>
                <td className="px-3 py-2.5 max-sm:hidden">{r.team}</td>
                <td className="px-3 py-2.5">
                  <span className="inline-flex items-center gap-1.5 capitalize">
                    <span
                      aria-hidden
                      className={cn("size-1.5 rounded-full", STATUS_DOT[r.status])}
                    />
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-muted-foreground max-md:hidden">
                  {r.lastActive}
                </td>
              </tr>
            ))}
            {result.total === 0 && (
              <tr>
                <td
                  colSpan={COLUMNS.length}
                  className="px-3 py-10 text-center text-muted-foreground"
                >
                  No members match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-muted-foreground" aria-live="polite" data-testid="table-range">
          {result.total === 0 ? "0 results" : `${result.from}–${result.to} of ${result.total}`}
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
          <span className="min-w-14 text-center font-mono text-xs">
            {result.page} / {result.pageCount}
          </span>
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
    </div>
  );
}
