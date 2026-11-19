import { expect, test } from "@playwright/test";

const project = () => test.info().project.name;

test("section heading words reveal on scroll and end fully visible", async ({ page }) => {
  await page.goto("/");
  const word = page.locator("#about h2 .word > span").first();
  await expect(page.locator("#about h2")).toHaveText(
    "I build interfaces that feel as good as they work.",
  );
  // Before it enters the viewport the word is masked (translated down).
  const before = await word.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
  expect(before).toBeGreaterThan(0);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 300);
  await expect
    .poll(() => word.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42))
    .toBe(0);
});

test("reduced motion disables scroll-driven animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const names = await page.evaluate(() =>
    [".reveal", ".reveal-mask", ".reveal-words .word > span"].map(
      (sel) => getComputedStyle(document.querySelector(sel)!).animationName,
    ),
  );
  expect(names).toEqual(["none", "none", "none"]);
});

test("project media mask opens as it scrolls into view", async ({ page }) => {
  await page.goto("/");
  const media = page.getByTestId("project-media").first();
  await media.scrollIntoViewIfNeeded();
  await page.mouse.wheel(0, 200);
  await expect
    .poll(() => media.evaluate((el) => getComputedStyle(el).clipPath))
    .toMatch(/^inset\(0(%|px)? round 12px\)$/);
});

test("scroll progress button appears, fills, and returns to top", async ({ page }) => {
  await page.goto("/");
  const button = page.getByTestId("scroll-progress");
  await expect(button).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await expect(button).toBeVisible();
  const ring = button.locator("circle").nth(1);
  await expect
    .poll(() => ring.evaluate((el) => parseFloat(getComputedStyle(el).strokeDasharray)))
    .toBeGreaterThan(0.1); // motion maps pathLength (scroll progress) to the dash length
  await button.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
  await expect(button).toHaveCount(0);
});

test("project card → case study runs a view transition (shared-element morph)", async ({
  page,
}) => {
  test.skip(project() !== "desktop", "one browser size is enough");
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.addInitScript(() => {
    const w = window as unknown as { __vt: number };
    w.__vt = 0;
    const original = document.startViewTransition?.bind(document);
    if (original) {
      document.startViewTransition = ((arg: Parameters<typeof original>[0]) => {
        w.__vt++;
        return original(arg);
      }) as typeof document.startViewTransition;
    }
  });
  await page.goto("/");
  await page.locator("#projects").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // allow prefetch so the morph pair forms
  await page.getByRole("link", { name: "KNS Connect", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/kns-connect$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("KNS Connect");
  expect(await page.evaluate(() => (window as unknown as { __vt: number }).__vt)).toBeGreaterThan(
    0,
  );
  expect(errors).toEqual([]);
});

test("reduced motion: JS (Motion) animations jump to their end state", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  // Hero chart bars normally grow in after ~0.9s; with reduced motion they are full height at once.
  const bar = page
    .getByRole("button", { name: /^Mon: / })
    .locator("span")
    .nth(0);
  await page.waitForTimeout(150);
  const scale = await bar.evaluate((el) => {
    const t = getComputedStyle(el).transform;
    return t === "none" ? 1 : new DOMMatrix(t).d;
  });
  expect(scale).toBe(1);
});
