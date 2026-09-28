import { test, expect } from "@playwright/test";

test("theme follows system, persists choice, and works across routes", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const toggle = page.getByRole("switch", { name: "Giao diện tối" });
  await expect(toggle).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await toggle.click();
  await expect(toggle).not.toBeChecked();
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(toggle).toBeEnabled();
  await expect(toggle).not.toBeChecked();
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toBeChecked();
  await page.locator('.landing-nav a[href="/san-pham"]').click();
  await expect(page).toHaveURL(/\/san-pham$/);
  await expect(toggle).toBeChecked();
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "/",
      "/san-pham/kinh-hien-vi-quang-hoc",
      "/lien-he",
      "/dashboard",
    ]) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await expect(toggle).toBeVisible();
      await expect(toggle).toBeChecked();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route} at ${width}px`,
      ).toBeTruthy();
    }
  }
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.screenshot({
    path: "test-results/theme-dark-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "test-results/theme-dark-mobile.png",
    fullPage: true,
  });
});

test("theme works when browser storage is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const getItem = Storage.prototype.getItem;
    const setItem = Storage.prototype.setItem;
    Storage.prototype.getItem = function (key) {
      if (key === "nha-theme") throw new Error("Theme storage unavailable");
      return getItem.call(this, key);
    };
    Storage.prototype.setItem = function (key, value) {
      if (key === "nha-theme") throw new Error("Theme storage unavailable");
      return setItem.call(this, key, value);
    };
  });
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const toggle = page.getByRole("switch", { name: "Giao diện tối" });
  await expect(toggle).not.toBeChecked();
  await toggle.click();
  await expect(toggle).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
