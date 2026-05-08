import { test, expect } from "@playwright/test";

test("loads studio shell", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Design Studio")).toBeVisible();
});
