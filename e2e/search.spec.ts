import { expect, test } from "@playwright/test";

test.describe("Search Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should search for valid username and redirect to profile page", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.fill("Technoblade");

    const submitButton = page.getByRole("button", { name: /Show me/i });
    await submitButton.click();

    await expect(page).toHaveURL(/\/stats\/Technoblade/);
  });

  test("should show loading state during search", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.fill("Technoblade");

    const submitButton = page.getByRole("button", { name: /Show me/i });
    await submitButton.click();

    await expect(page.locator("svg.animate-spin")).toBeVisible({ timeout: 1000 });
  });

  test("should handle search via Enter key", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.fill("Technoblade");
    await searchInput.press("Enter");

    await expect(page).toHaveURL(/\/stats\/Technoblade/);
  });

  test("should show error for non-existent user", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    const nonExistentUser = `nonexistentuser${Date.now()}`;
    await searchInput.fill(nonExistentUser);

    const submitButton = page.getByRole("button", { name: /Show me/i });
    await submitButton.click();

    await expect(page.getByText(/Something went wrong|not found|error/i)).toBeVisible({ timeout: 10000 });
  });

  test("should prevent search with invalid username format", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.fill("a");
    await searchInput.blur();

    const submitButton = page.getByRole("button", { name: /Show me/i });
    await expect(submitButton).toBeDisabled();
  });
});
