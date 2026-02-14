import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should load home page with search form", async ({ page }) => {
    await expect(page).toHaveTitle(/SkyCrypt/);

    const searchInput = page.getByPlaceholder("Enter username");
    await expect(searchInput).toBeVisible();

    const submitButton = page.getByRole("button", { name: /Show me/i });
    await expect(submitButton).toBeVisible();
  });

  test("should display validation error for invalid username", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.fill("!!invalid!!");
    await searchInput.press("Tab");

    await expect(page.getByText(/Please enter a valid Minecraft username or UUID/i)).toBeVisible();
  });

  test("should disable submit button for invalid username", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.fill("!!invalid!!");
    await searchInput.press("Tab");

    const submitButton = page.getByRole("button", { name: /Show me/i });
    await expect(submitButton).toBeDisabled();
  });

  test("should show contributors section", async ({ page }) => {
    await expect(page.getByText(/No favorites set!/i)).toBeVisible();
  });

  test("should show call-to-action card", async ({ page }) => {
    const ctaCard = page.locator("a[href*='patreon'], a[href*='discord'], a[href*='forms.gle']").first();
    await expect(ctaCard).toBeVisible();
  });
});
