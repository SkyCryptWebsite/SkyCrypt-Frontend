import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load home page with search form", async ({ page }) => {
    await expect(page).toHaveTitle(/SkyCrypt/);

    await expect(page.getByLabel("Show SkyBlock stats for")).toBeVisible();

    const searchInput = page.getByPlaceholder("Enter username");
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();

    const submitButton = page.getByRole("button", { name: /Show me/i });
    await expect(submitButton).toBeVisible();
  });

  test("should display validation error for empty search", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.fill("");
    await searchInput.blur();

    const submitButton = page.getByRole("button", { name: /Show me/i });
    await submitButton.click();

    await expect(page.getByText(/invalid/i)).toBeVisible();
  });

  test("should display validation error for invalid username", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.fill("a");
    await searchInput.blur();

    await expect(page.getByText(/String must contain at least 2 character/i)).toBeVisible();
  });

  test("should show contributors section", async ({ page }) => {
    await expect(page.getByText(/No favorites set!/i)).toBeVisible();

    await page.waitForSelector('[class*="contributor"]', { state: "visible", timeout: 10000 });

    const contributorCards = page.locator('[class*="contributor"]');
    await expect(contributorCards.first()).toBeVisible();
  });

  test("should show call-to-action card", async ({ page }) => {
    const ctaCard = page.locator("a[href*='patreon'], a[href*='discord'], a[href*='forms.gle']").first();
    await expect(ctaCard).toBeVisible();
  });
});
