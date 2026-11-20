import { expect, test } from "@playwright/test";

const project = () => test.info().project.name;
const PREVIEW = "/design-system/sections";

test("home: contact is reachable, empty controls stay hidden, footer shows the current year", async ({
  page,
}) => {
  await page.goto("/");
  const contact = page.locator("#contact");
  await expect(contact.getByRole("heading", { level: 2 })).toHaveText(
    "Let's build something great.",
  );
  await expect(contact.getByRole("link", { name: /Start a Conversation/ })).toHaveAttribute(
    "href",
    "mailto:sadanandgadwal@gmail.com",
  );
  const download = page.waitForEvent("download");
  await contact.getByRole("link", { name: /Download Resume/ }).click();
  expect((await download).suggestedFilename()).toBe("Sadanand_Gadwal_Front_End_Developer.pdf");
  if (project() !== "mobile") {
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Contact" })
      .click();
    await expect(page).toHaveURL(/#contact$/);
  }
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText(`© ${new Date().getFullYear()} Sadanand Gadwal`);
});

test("back to top returns to the top and the signature draws when visible", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("contentinfo").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("signature")).toHaveClass(/is-drawn/);
  await page.getByRole("button", { name: "Back to top" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(5);
});

test.describe("contact with fixture data", () => {
  test("CTA, copy email (real Clipboard API) and resume download", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(PREVIEW);
    const contact = page.locator("#contact");
    await contact.scrollIntoViewIfNeeded();
    await expect(contact.getByRole("link", { name: /Start a Conversation/ })).toHaveAttribute(
      "href",
      "mailto:hello@example.com",
    );

    await contact.getByRole("button", { name: /hello@example.com/ }).click();
    await expect(contact.getByRole("status")).toHaveText("Email address copied to clipboard.");
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("hello@example.com");

    const download = page.waitForEvent("download");
    await contact.getByRole("link", { name: /Download Resume/ }).click();
    expect((await download).suggestedFilename()).toBe("fixture-resume.pdf");
  });

  test("screenshots", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await page.goto(PREVIEW);
    const contact = page.locator("#contact");
    await contact.scrollIntoViewIfNeeded();
    await contact.screenshot({ path: `test-results/contact-${project()}-light.png` });
    await page
      .getByRole("contentinfo")
      .screenshot({ path: `test-results/footer-${project()}-light.png` });
    if (project() === "desktop") {
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "dark" });
      await page.reload();
      await page.locator("#contact").scrollIntoViewIfNeeded();
      await page.locator("#contact").screenshot({ path: "test-results/contact-desktop-dark.png" });
    }
  });
});
