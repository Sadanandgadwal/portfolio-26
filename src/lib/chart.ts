export type Point = { x: number; y: number };

const NICE_STEPS = [1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];

/** Rounds a max value up to a "nice" axis bound (1, 1.2, 1.5, 2, 2.5, 3, 4, 5, 6, 8 × 10ⁿ). */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(value));
  const n = value / exp;
  const step = NICE_STEPS.find((s) => n <= s) ?? 10;
  return Number((step * exp).toPrecision(12));
}

/** Evenly spaced points scaled into a width×height box (y grows downward). */
export function toPoints(values: number[], width: number, height: number, max: number): Point[] {
  const step = values.length > 1 ? width / (values.length - 1) : 0;
  return values.map((v, i) => ({ x: i * step, y: height - (v / max) * height }));
}

/** SVG path for a polyline and the matching closed area (for a fill). */
export function linePaths(points: Point[], height: number): { line: string; area: string } {
  if (points.length === 0) return { line: "", area: "" };
  const line = points
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");
  const last = points[points.length - 1];
  return {
    line,
    area: `${line} L${last.x.toFixed(2)},${height} L${points[0].x.toFixed(2)},${height} Z`,
  };
}

/** Index of the nearest point for a pointer x within [0, width]. */
export function nearestIndex(x: number, width: number, count: number): number {
  if (count <= 1) return 0;
  const i = Math.round((x / width) * (count - 1));
  return Math.min(Math.max(i, 0), count - 1);
}
