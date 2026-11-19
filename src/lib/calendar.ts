/** Date-only helpers using ISO "YYYY-MM-DD" strings and UTC math (no timezone drift). */

export const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const pad = (n: number) => String(n).padStart(2, "0");

export function toISO(d: Date): string {
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export function parseISO(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return toISO(d) === iso ? d : null; // rejects 2026-02-30
}

export function addDays(iso: string, days: number): string {
  const d = parseISO(iso)!;
  d.setUTCDate(d.getUTCDate() + days);
  return toISO(d);
}

/** Same day-of-month in another month, clamped (Jan 31 + 1 month → Feb 28/29). */
export function addMonths(iso: string, months: number): string {
  const d = parseISO(iso)!;
  const day = d.getUTCDate();
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + months, 1));
  const last = new Date(
    Date.UTC(target.getUTCFullYear(), target.getUTCMonth() + 1, 0),
  ).getUTCDate();
  target.setUTCDate(Math.min(day, last));
  return toISO(target);
}

/** Monday-first 6×7 grid of ISO dates covering the month of `iso`. */
export function monthGrid(iso: string): string[][] {
  const d = parseISO(iso)!;
  const first = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday = 0
  const start = toISO(new Date(first.getTime() - offset * 86_400_000));
  return Array.from({ length: 6 }, (_, w) =>
    Array.from({ length: 7 }, (_, i) => addDays(start, w * 7 + i)),
  );
}

export const sameMonth = (a: string, b: string) => a.slice(0, 7) === b.slice(0, 7);

export function isWeekend(iso: string): boolean {
  const day = parseISO(iso)?.getUTCDay();
  return day === 0 || day === 6;
}

export function monthLabel(iso: string): string {
  const d = parseISO(iso)!;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "Mon, 12 Jan 2026" — locale-independent display. */
export function formatLong(iso: string): string {
  const d = parseISO(iso);
  if (!d) return "";
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
  return `${wd}, ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].slice(0, 3)} ${d.getUTCFullYear()}`;
}
