import { expect, test } from "@playwright/test";

const isMobile = () => test.info().project.name === "mobile";
const isDesktop = () => test.info().project.name === "desktop";

test.describe("navigation", () => {
  test("header turns into a floating bar after scrolling", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header).not.toHaveAttribute("data-scrolled");
    await page.mouse.wheel(0, 600);
    await expect(header).toHaveAttribute("data-scrolled", "true");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(header).not.toHaveAttribute("data-scrolled");
  });

  test("desktop nav visible, mobile menu hidden (and vice versa)", async ({ page }) => {
    await page.goto("/");
    const primary = page.getByRole("navigation", { name: "Primary" });
    const openMenu = page.getByRole("button", { name: "Open menu" });
    if (isMobile()) {
      await expect(primary).toBeHidden();
      await expect(openMenu).toBeVisible();
    } else {
      await expect(primary).toBeVisible();
      await expect(openMenu).toBeHidden();
    }
  });

  test("mobile menu: opens, traps focus, closes with Escape and navigates", async ({ page }) => {
    test.skip(!isMobile(), "mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Menu" });
    await expect(dialog).toBeVisible();
    // Page behind the menu must not scroll.
    await expect(page.locator("body")).toHaveAttribute("data-scroll-locked", /\d/);
    await page.waitForTimeout(900); // let the reveal finish for the screenshot
    await page.screenshot({ path: "test-results/menu-mobile.png" });

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();

    await page.getByRole("button", { name: "Open menu" }).click();
    await dialog.getByRole("link", { name: /Home/ }).click();
    await expect(dialog).toBeHidden();
    await expect(page).toHaveURL(/#home$/);
  });

  test("skip link reaches main content", async ({ page }) => {
    test.skip(isMobile(), "keyboard flow on desktop/tablet");
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to content" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
  });
});

test.describe("hero", () => {
  test("entrance completes and CTAs point at sections", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText("Sadanand Gadwal");
    await expect(page.getByRole("link", { name: "View Projects" })).toHaveAttribute(
      "href",
      "#projects",
    );
    await expect(page.getByRole("link", { name: "Contact Me" })).toHaveAttribute(
      "href",
      "#contact",
    );
    await expect(page.getByRole("group", { name: /sample data/i })).toBeVisible();
    await page.waitForTimeout(1600); // let the entrance finish for the screenshot
    await page.screenshot({ path: `test-results/hero-${test.info().project.name}.png` });
  });

  test("mockup is interactive", async ({ page }) => {
    await page.goto("/");
    const mockup = page.getByRole("group", { name: /sample data/i });
    const modal = mockup.getByRole("group", { name: "Create report" });
    if (isMobile()) {
      await expect(modal).toBeHidden(); // floating modal is desktop/tablet only
      return;
    }
    await mockup.getByRole("button", { name: "Create" }).click();
    await expect(mockup.getByRole("status")).toContainText("Weekly summary");
    await mockup.getByRole("searchbox").fill("pinecrest");
    await expect(mockup.getByRole("table").getByRole("row")).toHaveCount(2);
  });
});

test.describe("cursor & magnetic", () => {
  test("custom cursor on desktop: dot, link ring and INTERACT label", async ({ page }) => {
    test.skip(!isDesktop(), "fine pointer only");
    await page.goto("/");
    const cursor = page.getByTestId("custom-cursor");
    await expect(page.locator("html")).toHaveClass(/has-custom-cursor/); // hydrated + enabled
    await page.mouse.move(40, 600);
    await expect(cursor).toHaveAttribute("data-mode", "dot");

    const cta = page.getByRole("link", { name: "Contact Me" });
    await cta.hover();
    await expect(cursor).toHaveAttribute("data-mode", "link");

    const mockup = page.getByRole("group", { name: /sample data/i });
    const box = (await mockup.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await expect(cursor).toHaveAttribute("data-mode", "label");
    await expect(cursor).toContainText(/interact/i);
  });

  test("no custom cursor on touch devices or with reduced motion", async ({ page }) => {
    if (isDesktop()) await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await expect(page.getByTestId("custom-cursor")).toHaveCount(0);
    await expect(page.locator("html")).not.toHaveClass(/has-custom-cursor/);
  });
});
