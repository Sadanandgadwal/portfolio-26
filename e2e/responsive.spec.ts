import { expect, test } from "@playwright/test";

const WIDTHS = [360, 390, 768, 1024, 1280, 1440];
const PAGES = ["/", "/projects/kns-connect", "/design-system", "/design-system/sections"];

test.describe("responsive sweep", () => {
  test.skip(() => test.info().project.name !== "desktop", "widths are set explicitly");

  for (const path of PAGES) {
    test(`no horizontal overflow: ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const offenders = await page.evaluate(() => {
          const vw = document.documentElement.clientWidth;
          const overflow = document.documentElement.scrollWidth - vw;
          // Report the widest elements that poke past the viewport (ignoring intentional scrollers).
          const wide = [...document.querySelectorAll<HTMLElement>("body *")]
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return (
                r.right > vw + 1 &&
                !el.closest("[class*='overflow-x-auto'], [class*='overflow-hidden']")
              );
            })
            .slice(0, 3)
            .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
          return { overflow, wide };
        });
        expect(
          offenders.overflow,
          `${path} @${width}px: ${offenders.wide.join(", ")}`,
        ).toBeLessThanOrEqual(0);
        if (path === "/" && (width === 360 || width === 1024)) {
          await page.screenshot({
            path: `test-results/responsive-home-${width}.png`,
            fullPage: true,
          });
        }
      }
    });
  }
});
