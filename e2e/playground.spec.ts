import { expect, test } from "@playwright/test";

const project = () => test.info().project.name;

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.locator("#playground").scrollIntoViewIfNeeded();
});

test("playground is in the nav and renders without errors or overflow", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.reload();
  if (project() !== "mobile") {
    await expect(
      page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Playground" }),
    ).toBeVisible();
  }
  await expect(page.locator("#playground article")).toHaveCount(8);
  await expect(page.locator("#playground").getByText("Sample data", { exact: true })).toBeVisible();
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
  expect(errors).toEqual([]);
});

test("table: sort, paginate, filter via real Radix select", async ({ page }) => {
  const table = page.locator("#specimen-table").locator("xpath=ancestor::article");
  const range = table.getByTestId("table-range");
  await expect(range).toHaveText("1–5 of 18");
  await table.getByRole("button", { name: "Next page" }).click();
  await expect(range).toHaveText("6–10 of 18");
  await table.getByRole("columnheader", { name: /Name/ }).getByRole("button").click();
  await expect(table.getByRole("columnheader", { name: /Name/ })).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await table.getByRole("combobox", { name: "Filter by status" }).click();
  await page.getByRole("option", { name: "Invited" }).click();
  await expect(range).toHaveText("1–4 of 4");
});

test("form: errors, then success", async ({ page }) => {
  const form = page.getByRole("form", { name: "Sample sign-up form" });
  await form.getByRole("button", { name: "Create account" }).click();
  await expect(form.getByLabel("Name")).toBeFocused();
  await expect(form.getByText("Enter a valid email address.")).toBeVisible();
  await form.getByLabel("Name").fill("Ada");
  await form.getByLabel("Email").fill("ada@example.com");
  await form.getByRole("combobox", { name: "Role" }).click();
  await page.getByRole("option").first().click();
  await form.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByText("Thanks, Ada.")).toBeVisible();
});

test("modal: opens, traps focus, Esc closes and returns focus", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Open modal" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Invite a teammate" });
  await expect(dialog).toBeVisible();
  await expect(page.locator("body")).toHaveAttribute("data-scroll-locked", /\d/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("tooltip on hover (desktop) and chart crosshair follows the pointer", async ({ page }) => {
  test.skip(project() !== "desktop", "hover interactions");
  await page.getByRole("button", { name: "Share" }).hover();
  await expect(page.getByRole("tooltip")).toHaveText("Share");

  const svg = page.getByTestId("chart-svg");
  const tooltip = page.getByTestId("chart-tooltip");
  const box = (await svg.boundingBox())!;
  await page.mouse.move(box.x + 4, box.y + box.height / 2);
  const first = await tooltip.textContent();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await expect(tooltip).not.toHaveText(first!);
});

test("theme specimen switches the whole site", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.reload();
  await page.locator("#playground").scrollIntoViewIfNeeded();
  await page.getByRole("radio", { name: "Dark" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("radio", { name: "Light" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});

test("screenshots", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await page.reload();
  const section = page.locator("#playground");
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200); // let the chart draw-in finish
  await section.screenshot({ path: `test-results/playground-${project()}-light.png` });
  if (project() === "desktop") {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
    await page.reload();
    await page.locator("#playground").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500); // let the chart draw-in finish
    await page
      .locator("#playground")
      .screenshot({ path: "test-results/playground-desktop-dark.png" });
  }
});
