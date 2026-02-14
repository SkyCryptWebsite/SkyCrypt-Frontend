import { expect, test } from "@playwright/test";

test.describe("Search Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should search and redirect to profile page", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.pressSequentially("Technoblade", { delay: 20 });
    await searchInput.press("Enter");

    await page.waitForURL(/\/stats\//, { timeout: 15000 });
    expect(page.url()).toContain("/stats/");
  });

  test("should trigger search on blur", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.pressSequentially("Technoblade", { delay: 20 });
    await searchInput.press("Tab");

    await page.waitForURL(/\/stats\//, { timeout: 15000 });
    expect(page.url()).toContain("/stats/");
  });

  test("should show error for non-existent user", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.pressSequentially("zzNotExist12345", { delay: 20 });
    await searchInput.press("Enter");

    await expect(page.getByText(/not found|Something went wrong|Failed to resolve/i)).toBeVisible({ timeout: 15000 });
  });

  test("should disable button for invalid username format", async ({ page }) => {
    const searchInput = page.getByPlaceholder("Enter username");
    await searchInput.fill("!!invalid!!");
    await searchInput.press("Tab");

    const submitButton = page.getByRole("button", { name: /Show me/i });
    await expect(submitButton).toBeDisabled();
  });
});
