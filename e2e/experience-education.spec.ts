import { expect, test, type Page } from "@playwright/test";

const project = () => test.info().project.name;
const PREVIEW = "/design-system/sections";

const progressScale = (page: Page) =>
  page.getByTestId("timeline-progress").evaluate((el) => {
    const t = getComputedStyle(el).transform;
    return t === "none" ? 1 : new DOMMatrix(t).d;
  });

test("home renders experience and education from the resume; nav links them", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#experience ol > li")).toHaveCount(3);
  await expect(page.locator("#experience")).toContainText("Digital Think Technologies LLP");
  await expect(page.locator("#experience")).toContainText("Sep 2023 — Present");
  await expect(page.locator("#education")).toContainText("Master of Computer Applications (MCA)");
  if (project() !== "mobile") {
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "Experience" })).toBeVisible();
    await expect(nav.getByRole("link", { name: "Projects" })).toBeVisible();
  }
});

test.describe("section previews (fixture data)", () => {
  test("timeline line fills on scroll and dots activate", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    await page.goto(PREVIEW);
    await expect(page.getByText("Fixture data")).toBeVisible();
    const entries = page.locator("#experience ol > li");
    await expect(entries).toHaveCount(2);

    await page.locator("#experience h2").scrollIntoViewIfNeeded();
    const early = await progressScale(page);
    await page.locator("#education").scrollIntoViewIfNeeded();
    await expect.poll(() => progressScale(page)).toBeGreaterThan(Math.max(early, 0.9));
    await expect(entries.first()).toHaveAttribute("data-active", "true");
    await expect(entries.last()).toHaveAttribute("data-active", "true");
    expect(errors).toEqual([]);
  });

  test("reduced motion shows the full timeline line immediately", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(PREVIEW);
    await expect.poll(() => progressScale(page)).toBe(1); // applied after hydration
  });

  test("stat counters land on their exact final values", async ({ page }) => {
    await page.goto(PREVIEW);
    const stats = page.locator("#about dl");
    await stats.scrollIntoViewIfNeeded();
    await expect(stats.getByText("12+", { exact: true }).first()).toBeVisible();
    await expect(stats.locator('[aria-hidden="true"]', { hasText: "98.5%" })).toBeVisible();
    await expect(stats.locator('[aria-hidden="true"]', { hasText: "1,500" })).toBeVisible();
  });

  test("certification link is external-safe; screenshots", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto(PREVIEW);
    const link = page
      .locator("#education")
      .getByRole("link", { name: /Fixture Certification \(linked\)/ });
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);

    const name = project();
    await page
      .locator("#experience")
      .screenshot({ path: `test-results/experience-${name}-light.png` });
    await page
      .locator("#education")
      .screenshot({ path: `test-results/education-${name}-light.png` });
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.reload();
    await page
      .locator("#experience")
      .screenshot({ path: `test-results/experience-${name}-dark.png` });
  });
});
