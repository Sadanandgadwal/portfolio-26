import { expect, test } from "@playwright/test";

const project = () => test.info().project.name;
const PREVIEW = "/design-system/sections";

test("home hides empty Projects; placeholder case-study route 404s", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#projects")).toHaveCount(0);
  const res = await page.goto("/projects/__placeholder__");
  expect(res?.status()).toBe(404);
});

test.describe("project showcase (fixture data)", () => {
  test("desktop hover plays the video preview lazily and pauses on leave", async ({ page }) => {
    test.skip(project() !== "desktop", "hover preview is desktop-only");
    const media: string[] = [];
    page.on("request", (r) => r.url().endsWith(".webm") && media.push(r.url()));

    await page.goto(PREVIEW);
    const card = page.locator("#projects article").first();
    await card.scrollIntoViewIfNeeded();
    await expect(card.getByTestId("project-preview-video")).toHaveCount(0);
    expect(media).toEqual([]); // nothing fetched before hover

    const box = (await card.getByTestId("project-media").boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    const video = card.getByTestId("project-preview-video");
    await expect(video).toBeAttached();
    await expect
      .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0))
      .toBe(true);
    await expect(page.getByTestId("custom-cursor")).toContainText(/view/i);

    await page.mouse.move(5, 5);
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  });

  test("tall screenshot pans on hover when there is no preview", async ({ page }) => {
    test.skip(project() !== "desktop", "hover-only effect");
    await page.goto(PREVIEW);
    const card = page.locator("#projects article").nth(1);
    const img = card.getByRole("img");
    await card.scrollIntoViewIfNeeded();
    const before = await img.evaluate((el) => getComputedStyle(el).objectPosition);
    await card.locator("[data-cursor=view]").hover();
    await expect
      .poll(() => img.evaluate((el) => getComputedStyle(el).objectPosition))
      .not.toBe(before);
  });

  test("mobile carousel scroll-snaps horizontally", async ({ page }) => {
    test.skip(project() !== "mobile", "mobile layout");
    await page.goto(PREVIEW);
    const list = page.getByRole("list", { name: "Projects" });
    await list.scrollIntoViewIfNeeded();
    await expect(list).toHaveCSS("scroll-snap-type", /x mandatory/);
    await list.evaluate((el) => el.scrollBy({ left: el.clientWidth * 0.6 }));
    await expect.poll(() => list.evaluate((el) => el.scrollLeft)).toBeGreaterThan(100);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0); // carousel scrolls, page does not
    await page.locator("#projects").screenshot({ path: "test-results/projects-mobile.png" });
  });

  test("card opens the case study; next-project and lightbox work", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(PREVIEW);
    await page.getByRole("link", { name: "Fixture ERP Dashboard", exact: true }).click();
    await expect(page).toHaveURL(/\/design-system\/projects\/fixture-erp-dashboard$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fixture ERP Dashboard");
    await expect(page).toHaveTitle(/Fixture ERP Dashboard/);

    await page
      .getByRole("button", { name: /Open larger view/ })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.getByRole("link", { name: /Next project/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Fixture Design System");
    expect(errors).toEqual([]);
  });

  test("screenshots", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(PREVIEW);
    if (project() === "desktop") {
      await page.locator("#projects").screenshot({ path: "test-results/projects-desktop.png" });
    }
    await page.goto("/design-system/projects/fixture-erp-dashboard");
    await page.waitForTimeout(400);
    await page.screenshot({ path: `test-results/case-study-${project()}.png`, fullPage: true });
  });
});
