export type SortDirection = "asc" | "desc";

export type TableQuery<T> = {
  search: string;
  searchKeys: (keyof T)[];
  /** Exact-match filter; `null` value = no filter. */
  filter?: { key: keyof T; value: string | null };
  sort?: { key: keyof T; direction: SortDirection } | null;
  page: number;
  pageSize: number;
};

export type TableResult<T> = {
  rows: T[];
  total: number;
  page: number;
  pageCount: number;
  /** 1-based inclusive range for "1–5 of 18" labels; 0–0 when empty. */
  from: number;
  to: number;
};

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });

function compare(a: unknown, b: unknown): number {
  if (typeof a === "number" && typeof b === "number") return a - b;
  return collator.compare(String(a ?? ""), String(b ?? ""));
}

/** Search → filter → sort → paginate. Pure; the page is clamped into range. */
export function queryRows<T extends object>(rows: T[], q: TableQuery<T>): TableResult<T> {
  const needle = q.search.trim().toLowerCase();
  let result = needle
    ? rows.filter((row) => q.searchKeys.some((k) => String(row[k]).toLowerCase().includes(needle)))
    : rows;

  if (q.filter && q.filter.value !== null) {
    const { key, value } = q.filter;
    result = result.filter((row) => String(row[key]) === value);
  }

  if (q.sort) {
    const { key, direction } = q.sort;
    const sign = direction === "asc" ? 1 : -1;
    result = [...result].sort((a, b) => sign * compare(a[key], b[key]));
  }

  const total = result.length;
  const pageSize = Math.max(1, q.pageSize);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, q.page), pageCount);
  const start = (page - 1) * pageSize;

  return {
    rows: result.slice(start, start + pageSize),
    total,
    page,
    pageCount,
    from: total === 0 ? 0 : start + 1,
    to: Math.min(start + pageSize, total),
  };
}

/** Header click cycle: none → asc → desc → none. */
export function nextSort<K>(
  current: { key: K; direction: SortDirection } | null,
  key: K,
): { key: K; direction: SortDirection } | null {
  if (!current || current.key !== key) return { key, direction: "asc" };
  return current.direction === "asc" ? { key, direction: "desc" } : null;
}
