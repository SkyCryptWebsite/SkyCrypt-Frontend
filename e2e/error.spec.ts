import { expect, test } from "@playwright/test";

test.describe("Error Handling", () => {
  test("should show error page for invalid route", async ({ page }) => {
    await page.goto("/stats/nonexistentuser123456789");

    const errorMessage = page.getByText(/An unexpected error|error|not found/i);
    await expect(errorMessage).toBeVisible({ timeout: 30000 });
  });

  test("should show error message with retry option", async ({ page }) => {
    await page.goto("/stats/invaliduser999999");

    await page.waitForLoadState("networkidle");

    const errorNotice = page.getByText(/An unexpected error/i);
    if (await errorNotice.isVisible()) {
      const retryButton = page.getByRole("button", { name: /retry|try again/i });
      await expect(retryButton).toBeVisible();
    }
  });

  test("should handle network errors gracefully", async ({ page, context }) => {
    await context.route("**/api/**", (route) => route.abort());

    await page.goto("/stats/Technoblade");

    await expect(page.getByText(/error|failed/i)).toBeVisible({ timeout: 30000 });
  });

  test("should maintain navigation after error", async ({ page }) => {
    await page.goto("/stats/nonexistentuser123456789");

    await page.waitForLoadState("networkidle");

    await page.goto("/");

    await expect(page.getByPlaceholder("Enter username")).toBeVisible();
  });
});
