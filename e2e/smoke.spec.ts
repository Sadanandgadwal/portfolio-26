import { expect, test } from "@playwright/test";

test("home renders without console errors or failed requests", async ({ page }) => {
  const errors: string[] = [];
  const failed: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("requestfailed", (r) => failed.push(r.url()));
  page.on("response", (r) => r.status() >= 400 && failed.push(`${r.status()} ${r.url()}`));

  await page.goto("/");
  await expect(page).toHaveTitle(/Sadanand Gadwal/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sadanand Gadwal");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://sadanandgadwal.com",
  );

  // No horizontal overflow at any viewport.
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);

  await page.screenshot({
    path: `test-results/home-${test.info().project.name}.png`,
    fullPage: true,
  });
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
});
