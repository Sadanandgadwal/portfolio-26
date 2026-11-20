import { expect, test } from "@playwright/test";

// Records <html> class at the moment <body> is created, i.e. before first paint and before hydration.
const recordClassBeforePaint = () => {
  new MutationObserver((_, observer) => {
    if (document.body) {
      (window as unknown as { __classAtBody: string }).__classAtBody =
        document.documentElement.className;
      observer.disconnect();
    }
  }).observe(document, { childList: true, subtree: true });
};
const classAtBody = (page: import("@playwright/test").Page) =>
  page.evaluate(() => (window as unknown as { __classAtBody: string }).__classAtBody);

test.describe("theme", () => {
  test("follows OS dark preference before first paint (no flash)", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.addInitScript(recordClassBeforePaint);
    await page.goto("/");
    expect(await classAtBody(page)).toContain("dark");
    await expect(page.getByRole("button", { name: "Switch to light theme" })).toBeVisible();
  });

  test("toggle persists across reloads and applies before paint", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.addInitScript(recordClassBeforePaint);
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(html).toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");

    await page.reload();
    expect(await classAtBody(page)).toContain("dark");
    await expect(html).toHaveClass(/dark/);
  });

  test("background actually changes between themes", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");
    const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    const light = await bg();
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect.poll(bg).not.toBe(light);
  });
});

test("design system page renders cleanly in both themes", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/design-system");
  await expect(page.getByRole("heading", { level: 2, name: "Design system." })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);

  const name = test.info().project.name;
  await page.screenshot({ path: `test-results/ds-${name}-light.png`, fullPage: true });
  await page.getByTestId("theme-toggle").first().click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.screenshot({ path: `test-results/ds-${name}-dark.png`, fullPage: true });

  // Loading button demo
  await page.getByRole("button", { name: "Click to load" }).click();
  await expect(page.getByRole("button", { name: "Saving…" })).toHaveAttribute("aria-busy", "true");
  await expect(page.getByRole("button", { name: "Click to load" })).toBeEnabled();

  expect(errors).toEqual([]);
});
