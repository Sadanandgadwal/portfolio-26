import { expect, test } from "@playwright/test";

const project = () => test.info().project.name;

test("nav link scrolls to About and marks it active", async ({ page }) => {
  await page.goto("/");
  const about = page.locator("#about");
  if (project() === "mobile") {
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: /About/ }).click();
  } else {
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "About" })
      .click();
  }
  await expect(page).toHaveURL(/#about$/);
  await expect(about.getByRole("heading", { level: 2 })).toBeInViewport();
  if (project() !== "mobile") {
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "About" }),
    ).toHaveAttribute("aria-current", "true");
  }
  await about.screenshot({ path: `test-results/about-${project()}.png` });
});

test.describe("skills explorer", () => {
  const tile = (page: import("@playwright/test").Page, name: string) =>
    page.locator("#skills button[data-active]", { hasText: name }).first();
  const visibleDetail = (page: import("@playwright/test").Page) =>
    page.locator('[data-testid="skill-detail-name"]:visible');

  test("hover/tap a technology updates the detail panel", async ({ page }) => {
    await page.goto("/#skills");
    await expect(visibleDetail(page)).toHaveText("React.js");
    if (project() === "mobile") await tile(page, "TypeScript").tap();
    else await tile(page, "TypeScript").hover();
    await expect(visibleDetail(page)).toHaveText("TypeScript");
    await expect(tile(page, "TypeScript")).toHaveAttribute("aria-pressed", "true");
  });

  test("category filter removes other groups and selects within the category", async ({ page }) => {
    await page.goto("/#skills");
    const skills = page.locator("#skills");
    await skills.getByRole("button", { name: /^Database/ }).click();
    await expect(skills.getByRole("heading", { level: 3, name: "Frontend" })).toHaveCount(0);
    await expect(skills.getByRole("heading", { level: 3, name: "Database" })).toBeVisible();
    await expect(visibleDetail(page)).toHaveText("MongoDB");
    await skills.getByRole("button", { name: /^All/ }).click();
    await expect(skills.getByRole("heading", { level: 3 })).toHaveCount(6);
  });

  test("screenshots (light + dark)", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.goto("/");
    const skills = page.locator("#skills");
    await skills.scrollIntoViewIfNeeded();
    await skills.screenshot({ path: `test-results/skills-${project()}-light.png` });
    await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
    await page.reload();
    await page.locator("#skills").screenshot({ path: `test-results/skills-${project()}-dark.png` });
  });
});
