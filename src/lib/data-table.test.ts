import { describe, expect, it } from "vitest";
import { nextSort, queryRows, type TableQuery } from "./data-table";

type Row = { name: string; team: string; score: number };
const rows: Row[] = [
  { name: "Charlie", team: "Design", score: 9 },
  { name: "alice", team: "Eng", score: 30 },
  { name: "Bob", team: "Eng", score: 100 },
  { name: "Dana", team: "Design", score: 9 },
  { name: "Eve", team: "Sales", score: 2 },
];
const base: TableQuery<Row> = { search: "", searchKeys: ["name", "team"], page: 1, pageSize: 2 };

describe("queryRows", () => {
  it("paginates with a correct range label", () => {
    const r = queryRows(rows, base);
    expect(r).toMatchObject({ total: 5, pageCount: 3, page: 1, from: 1, to: 2 });
    expect(queryRows(rows, { ...base, page: 3 })).toMatchObject({ from: 5, to: 5 });
  });

  it("clamps out-of-range pages (e.g. after filtering shrinks results)", () => {
    expect(queryRows(rows, { ...base, page: 99 }).page).toBe(3);
    expect(queryRows(rows, { ...base, page: 0 }).page).toBe(1);
  });

  it("searches case-insensitively across keys", () => {
    expect(
      queryRows(rows, { ...base, search: "  ENG ", pageSize: 10 }).rows.map((r) => r.name),
    ).toEqual(["alice", "Bob"]);
  });

  it("filters by exact value; null disables the filter", () => {
    expect(queryRows(rows, { ...base, filter: { key: "team", value: "Design" } }).total).toBe(2);
    expect(queryRows(rows, { ...base, filter: { key: "team", value: null } }).total).toBe(5);
  });

  it("sorts strings case-insensitively and numbers numerically, stable for ties", () => {
    const byName = queryRows(rows, {
      ...base,
      pageSize: 10,
      sort: { key: "name", direction: "asc" },
    });
    expect(byName.rows.map((r) => r.name)).toEqual(["alice", "Bob", "Charlie", "Dana", "Eve"]);
    const byScore = queryRows(rows, {
      ...base,
      pageSize: 10,
      sort: { key: "score", direction: "desc" },
    });
    expect(byScore.rows.map((r) => r.score)).toEqual([100, 30, 9, 9, 2]);
    expect(byScore.rows.filter((r) => r.score === 9).map((r) => r.name)).toEqual([
      "Charlie",
      "Dana",
    ]);
  });

  it("does not mutate the input and handles empty results", () => {
    const copy = [...rows];
    queryRows(rows, { ...base, sort: { key: "score", direction: "asc" } });
    expect(rows).toEqual(copy);
    expect(queryRows(rows, { ...base, search: "zzz" })).toMatchObject({
      total: 0,
      from: 0,
      to: 0,
      pageCount: 1,
    });
  });
});

describe("nextSort", () => {
  it("cycles none → asc → desc → none, and resets on a new column", () => {
    const asc = nextSort(null, "name");
    expect(asc).toEqual({ key: "name", direction: "asc" });
    const desc = nextSort(asc, "name");
    expect(desc).toEqual({ key: "name", direction: "desc" });
    expect(nextSort(desc, "name")).toBeNull();
    expect(nextSort(desc, "team")).toEqual({ key: "team", direction: "asc" });
  });
});
