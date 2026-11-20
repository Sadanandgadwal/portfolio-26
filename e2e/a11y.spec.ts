import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/projects/kns-connect", "/design-system", "/design-system/sections"];

for (const path of PAGES) {
  for (const scheme of ["light", "dark"] as const) {
    test(`axe: ${path} (${scheme})`, async ({ page }) => {
      test.skip(test.info().project.name === "tablet", "desktop + mobile cover the layouts");
      await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
        .analyze();
      const summary = results.violations.map(
        (v) =>
          `${v.id} [${v.impact}] ×${v.nodes.length}: ${v.nodes
            .slice(0, 3)
            .map((n) => n.target.join(" "))
            .join(" | ")}`,
      );
      if (process.env.A11Y_REPORT)
        console.log(
          `A11Y ${test.info().project.name} ${path} ${scheme} :: ${summary.join(" || ") || "OK"}`,
        );
      expect(summary, summary.join("\n")).toEqual([]);
    });
  }
}
