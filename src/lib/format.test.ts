import { describe, expect, it } from "vitest";
import { formatDateRange, formatDuration, formatYearMonth } from "./format";

describe("formatYearMonth", () => {
  it.each([
    ["2023-04", "Apr 2023"],
    ["2023-12", "Dec 2023"],
    ["2021", "2021"],
    ["", ""],
    ["2023-13", ""],
    ["April 2023", ""],
  ])("%s → %s", (input, expected) => expect(formatYearMonth(input)).toBe(expected));
});

describe("formatDateRange", () => {
  it("formats closed, ongoing and single-point ranges", () => {
    expect(formatDateRange("2021-06", "2023-02")).toBe("Jun 2021 — Feb 2023");
    expect(formatDateRange("2023-04", "")).toBe("Apr 2023 — Present");
    expect(formatDateRange("2019", "2019")).toBe("2019");
    expect(formatDateRange("", "2020")).toBe("");
    expect(formatDateRange("2024-01", "", "Ongoing")).toBe("Jan 2024 — Ongoing");
  });
});

describe("formatDuration", () => {
  it("counts inclusive months for closed ranges", () => {
    expect(formatDuration("2021-01", "2021-01")).toBe("1 mo");
    expect(formatDuration("2021-01", "2022-03")).toBe("1 yr 3 mos");
    expect(formatDuration("2020-01", "2021-12")).toBe("2 yrs");
  });
  it("returns empty for ongoing, year-only or reversed ranges", () => {
    expect(formatDuration("2023-04", "")).toBe("");
    expect(formatDuration("2020", "2022")).toBe("");
    expect(formatDuration("2022-05", "2021-01")).toBe("");
  });
});
