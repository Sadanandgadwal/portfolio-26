const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Parsed = { year: number; month: number | null };

function parse(value: string): Parsed | null {
  const m = /^(\d{4})(?:-(\d{2}))?$/.exec(value);
  if (!m) return null;
  const month = m[2] ? Number(m[2]) : null;
  if (month !== null && (month < 1 || month > 12)) return null;
  return { year: Number(m[1]), month };
}

/** "2023-04" → "Apr 2023", "2023" → "2023", invalid/empty → "". Locale-independent (SSR-safe). */
export function formatYearMonth(value: string): string {
  const p = parse(value);
  if (!p) return "";
  return p.month ? `${MONTHS[p.month - 1]} ${p.year}` : String(p.year);
}

/** "Apr 2023 — Present". Empty end = ongoing. Empty start = "". */
export function formatDateRange(start: string, end: string, ongoingLabel = "Present"): string {
  const from = formatYearMonth(start);
  if (!from) return "";
  const to = end ? formatYearMonth(end) : ongoingLabel;
  return to && to !== from ? `${from} — ${to}` : from;
}

/**
 * Inclusive duration for closed month ranges: "1 yr 3 mos". Ongoing ranges return "" on purpose:
 * using the current date would make static prerendering time-dependent.
 */
export function formatDuration(start: string, end: string): string {
  const a = parse(start);
  const b = parse(end);
  if (!a?.month || !b?.month) return "";
  const months = (b.year - a.year) * 12 + (b.month - a.month) + 1;
  if (months <= 0) return "";
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(
    Boolean,
  );
  return parts.join(" ");
}
