import raw from "@/data/portfolio.json";
import { portfolioSchema, type Portfolio, type Social } from "./schema";

/** Parse + validate content. Throws a readable error so `next build` fails on bad JSON. */
export function parsePortfolio(input: unknown): Portfolio {
  const result = portfolioSchema.safeParse(input);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  • ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(`Invalid src/data/portfolio.json:\n${issues}`);
  }
  return result.data;
}

/** Validated portfolio content. Import from Server Components; pass slices to Client Components as props. */
export const portfolio: Portfolio = parsePortfolio(raw);

/**
 * Fills the "email" social from `personal.email` when its URL is empty (single source of truth),
 * then hides placeholders.
 */
export function resolveSocials(socials: Social[], email: string): Social[] {
  const filled = socials.map((s) =>
    s.platform === "email" && !s.url && email ? { ...s, url: `mailto:${email}` } : s,
  );
  return getVisibleSocials(filled);
}

/** Socials with a configured URL (placeholders are hidden). */
export function getVisibleSocials(socials: Social[]): Social[] {
  return socials.filter((s) => s.url !== "");
}

export type * from "./schema";

/** Only link to sections that are actually rendered on the page. */
export function visibleNavItems<T extends { href: string }>(
  items: T[],
  renderedIds: Iterable<string>,
): T[] {
  const ids = new Set(renderedIds);
  return items.filter((i) => !i.href.startsWith("#") || ids.has(i.href.slice(1)));
}
