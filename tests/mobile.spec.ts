import { test, expect } from '../fixtures';

// This file runs only on mobile-chrome (Pixel 5) and mobile-safari (iPhone 13)
// as configured via testMatch in playwright.config.ts

test.describe('Mobile — Homepage', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('page title is correct on mobile', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('hero heading is visible on mobile viewport', async ({ homePage }) => {
    await expect(homePage.heroTitle).toBeVisible();
  });

  test('"Get started" button is tappable on mobile', async ({ homePage, page }) => {
    await expect(homePage.getStartedButton).toBeVisible();
    await homePage.clickGetStarted();
    await expect(page).toHaveURL(/\/docs\/intro/);
  });
});

test.describe('Mobile — Navigation', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('hamburger menu button is visible on mobile', async ({ page }) => {
    const menuButton = page
      .locator('button.navbar__toggle, [aria-label*="menu"], [aria-label*="navigation"]')
      .first();
    await expect(menuButton).toBeVisible();
  });

  test('tapping hamburger opens nav sidebar', async ({ page }) => {
    const menuButton = page
      .locator('button.navbar__toggle, [aria-label*="menu"]')
      .first();
    await menuButton.click();
    const nav = page.locator('.navbar-sidebar');
    await expect(nav).toBeVisible();
  });
});

test.describe('Mobile — Search', () => {
  test('search icon button is visible on mobile', async ({ homePage, searchModal }) => {
    await homePage.goto();
    await expect(searchModal.searchButton).toBeVisible();
  });

  test('tapping search opens search modal', async ({ homePage, searchModal }) => {
    await homePage.goto();
    await searchModal.open();
    await expect(searchModal.modal).toBeVisible();
  });
});

test.describe('Mobile — Viewport', () => {
  test('no horizontal overflow on homepage at mobile width', async ({ homePage, page }) => {
    await homePage.goto();
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width ?? 390;
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });

  test('no horizontal overflow on docs page at mobile width', async ({ docsPage, page }) => {
    await docsPage.goto('/docs/intro');
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width ?? 390;
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 5);
  });
});
