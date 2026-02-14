import { expect, test } from "@playwright/test";

test.describe("Profile Page", () => {
  test("should load profile page for valid username", async ({ page }) => {
    await page.goto("/stats/Technoblade");

    await expect(page).toHaveTitle(/Technoblade/);

    const loadingIndicator = page.getByText(/Loading profile/i);
    if (await loadingIndicator.isVisible()) {
      await loadingIndicator.waitFor({ state: "hidden", timeout: 30000 });
    }

    await expect(page.locator("body")).not.toContainText(/An unexpected error/i);
  });

  test("should display profile sections after loading", async ({ page }) => {
    await page.goto("/stats/Technoblade");

    await page.waitForLoadState("networkidle");

    const profileSections = page.locator('[data-section], section, [class*="section"]');
    await expect(profileSections.first()).toBeVisible({ timeout: 30000 });
  });

  test("should navigate to profile with profile ID", async ({ page }) => {
    await page.goto("/stats/Technoblade/some-profile-id");

    await expect(page).toHaveURL(/\/stats\/Technoblade\/some-profile-id/);

    const loadingIndicator = page.getByText(/Loading profile/i);
    if (await loadingIndicator.isVisible()) {
      await loadingIndicator.waitFor({ state: "hidden", timeout: 30000 });
    }
  });

  test("should show loading state initially", async ({ page }) => {
    await page.goto("/stats/Technoblade");

    await expect(page.getByText(/Loading profile/i)).toBeVisible({ timeout: 5000 });
  });

  test("should handle hash navigation to sections", async ({ page }) => {
    await page.goto("/stats/Technoblade#skills");

    await expect(page).toHaveURL(/\/stats\/Technoblade#skills/);

    const loadingIndicator = page.getByText(/Loading profile/i);
    if (await loadingIndicator.isVisible()) {
      await loadingIndicator.waitFor({ state: "hidden", timeout: 30000 });
    }
  });
});
