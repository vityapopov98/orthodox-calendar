import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("https://azbyka.ru/days/2026-02-23");

  const calendar = page.locator("#calendar_day");
  const day = calendar.locator(".days.mob-hide");
  const newDay = calendar.locator("newstyle");
  const oldDay = calendar.locator("oldstyle");

  await expect(calendar).toBeVisible();
  await expect(day).toBeVisible();
  await expect(day).toBeVisible();
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

// npx playwright codegen --ignore-https-errors https://azbyka.ru/days/2026-02-23

// test("get started link", async ({ page }) => {
//   await page.goto("https://playwright.dev/");

//   // Click the get started link.
//   await page.getByRole("link", { name: "Get started" }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(
//     page.getByRole("heading", { name: "Installation" }),
//   ).toBeVisible();
// });
