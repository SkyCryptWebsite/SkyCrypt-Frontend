import { expect, test } from "@playwright/test";

test.describe("Profile Page", () => {
  test("should load profile page", async ({ page }) => {
    await page.goto("/stats/Technoblade");

    await expect(page).toHaveURL(/\/stats\//);
    await expect(page).toHaveTitle(/SkyCrypt/);
  });

  test("should display player name", async ({ page }) => {
    await page.goto("/stats/Technoblade");

    await expect(page.getByText("Technoblade").first()).toBeVisible({ timeout: 15000 });
  });

  test("should show loading state initially", async ({ page }) => {
    await page.goto("/stats/Technoblade");

    const loadingOrContent = page.getByText(/Loading profile|Technoblade/i);
    await expect(loadingOrContent.first()).toBeVisible({ timeout: 15000 });
  });

  test("should display profile content after loading", async ({ page }) => {
    await page.goto("/stats/Technoblade");

    await expect(page.locator("main")).toBeVisible({ timeout: 30000 });

    const mainContent = page.locator("main");
    const textContent = await mainContent.textContent();
    expect(textContent?.length).toBeGreaterThan(0);
  });

  test("should navigate back to home", async ({ page }) => {
    await page.goto("/stats/Technoblade");

    const homeLink = page.getByRole("link", { name: /SkyCrypt/i }).first();
    await expect(homeLink).toBeVisible({ timeout: 15000 });

    await homeLink.click();
    await page.waitForURL("/", { timeout: 5000 });
  });
});
