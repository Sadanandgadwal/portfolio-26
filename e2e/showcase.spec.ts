import { expect, test } from "@playwright/test";

const project = () => test.info().project.name;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator("#showcase").scrollIntoViewIfNeeded();
});

const sidebar = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Orbit ERP navigation" });
const topNav = (page: import("@playwright/test").Page) =>
  page.getByRole("navigation", { name: "Orbit ERP sections" });

test("layout responds to its own width (container queries)", async ({ page }) => {
  if (project() === "mobile") {
    await expect(sidebar(page)).toBeHidden();
    await expect(topNav(page)).toBeVisible();
    return;
  }
  const viewport = page.getByTestId("showcase-viewport");
  if (project() === "desktop") await expect(sidebar(page)).toBeVisible();

  await page.getByRole("radio", { name: "Mobile" }).click();
  await expect.poll(async () => (await viewport.boundingBox())!.width).toBeLessThanOrEqual(392);
  await expect(sidebar(page)).toBeHidden();
  await expect(topNav(page)).toBeVisible();

  await page.getByRole("radio", { name: "Desktop" }).click();
  if (project() === "desktop") await expect(sidebar(page)).toBeVisible();
});

test("sidebar collapses to icons (desktop)", async ({ page }) => {
  test.skip(project() !== "desktop", "sidebar only at wide widths");
  const nav = sidebar(page);
  const wide = (await nav.boundingBox())!.width;
  await nav.getByRole("button", { name: "Collapse sidebar" }).click();
  await expect.poll(async () => (await nav.boundingBox())!.width).toBeLessThan(wide / 2);
  await nav.getByRole("button", { name: "Orders" }).click(); // still operable when collapsed
  await expect(page.getByRole("searchbox", { name: "Search orders", exact: true })).toBeVisible();
});

test("orders: filter, open detail, ship, see status change", async ({ page }) => {
  await page.getByTestId("showcase-content").scrollIntoViewIfNeeded();
  const nav = project() === "desktop" ? sidebar(page) : topNav(page);
  await nav.getByRole("button", { name: "Orders" }).click();
  await page.getByRole("combobox", { name: "Filter orders by status" }).click();
  await page.getByRole("option", { name: "Paid" }).click();
  const first = page
    .getByTestId("showcase-content")
    .locator("tbody tr")
    .first()
    .getByRole("button");
  const id = (await first.textContent())!;
  await first.click();
  const dialog = page.getByRole("dialog", { name: `Order ${id}` });
  await dialog.getByRole("button", { name: "Mark as shipped" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByTestId("orders-range")).toHaveText(`${id} marked as shipped.`);
});

test("form: autocomplete + keyboard date picker + error summary", async ({ page }) => {
  const nav = project() === "desktop" ? sidebar(page) : topNav(page);
  await nav.getByRole("button", { name: "New customer" }).click();
  const form = page.getByRole("form", { name: "New customer" });
  await form.getByRole("button", { name: "Add customer" }).click();
  await expect(form.getByRole("alert")).toBeFocused();

  await form.getByLabel("Company").fill("Acme");
  await form.getByLabel("Billing email").fill("billing@example.com");
  await form.getByRole("combobox").fill("swe");
  await page.keyboard.press("Enter");
  await expect(form.getByRole("combobox")).toHaveValue("Sweden");

  await form.getByRole("button", { name: /Contract start/ }).click();
  const grid = page.getByRole("grid");
  await expect(grid).toBeVisible();
  await page.keyboard.press("ArrowRight"); // Tue 1 Dec → Wed 2 Dec 2026
  await page.keyboard.press("Enter");
  await expect(form.getByRole("button", { name: /Contract start Wed, 2 Dec 2026/ })).toBeVisible();

  await form.getByRole("button", { name: "Add customer" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Acme added" })).toBeVisible();
});

test("screenshots", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.reload();
  const section = page.locator("#showcase");
  await section.scrollIntoViewIfNeeded();
  await section.screenshot({ path: `test-results/showcase-${project()}-light.png` });
  if (project() === "desktop") {
    await page.getByRole("radio", { name: "Tablet" }).click();
    await page.waitForTimeout(400);
    await section.screenshot({ path: "test-results/showcase-desktop-tabletframe.png" });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
    await page.getByRole("radio", { name: "Desktop" }).click();
    await page.waitForTimeout(400);
    await sidebar(page).getByRole("button", { name: "Orders" }).click();
    await section.screenshot({ path: "test-results/showcase-desktop-dark-orders.png" });
  }
});
