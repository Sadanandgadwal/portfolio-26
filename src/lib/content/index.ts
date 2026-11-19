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

/** Socials with a configured URL (placeholders are hidden). */
export function getVisibleSocials(socials: Social[]): Social[] {
  return socials.filter((s) => s.url !== "");
}

export type * from "./schema";
