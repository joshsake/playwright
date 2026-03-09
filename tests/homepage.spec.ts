import { test, expect } from '../fixtures';

test.describe('Homepage — Hero Section', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('page title contains "Playwright"', async ({ page }) => {
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('hero heading is visible', async ({ homePage }) => {
    await expect(homePage.heroTitle).toBeVisible();
    await expect(homePage.heroTitle).toContainText('Playwright');
  });

  test('"Get started" button is visible and navigates to docs', async ({ homePage, page }) => {
    await expect(homePage.getStartedButton).toBeVisible();
    await homePage.clickGetStarted();
    await expect(page).toHaveURL(/\/docs\/intro/);
  });

  test('page loads within performance budget', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(10_000);
  });
});

test.describe('Homepage — Navigation', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('top nav contains Docs link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Docs' })).toBeVisible();
  });

  test('top nav contains API link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'API' })).toBeVisible();
  });

  test('top nav contains Community link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Community' })).toBeVisible();
  });

  test('clicking Docs nav link navigates to /docs/intro', async ({ homePage, page }) => {
    await homePage.clickNavLink('Docs');
    await expect(page).toHaveURL(/\/docs\/intro/);
  });

  test('clicking API link navigates to API reference', async ({ homePage, page }) => {
    await homePage.clickNavLink('API');
    await expect(page).toHaveURL(/\/docs\/api/);
  });
});

test.describe('Homepage — Feature Cards', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('feature cards are rendered', async ({ homePage }) => {
    await expect(homePage.featureCards.first()).toBeVisible();
  });

  test('feature cards contain expected content keywords', async ({ homePage }) => {
    const cardTexts = await homePage.featureCards.allTextContents();
    const combined = cardTexts.join(' ').toLowerCase();
    expect(combined).toMatch(/browser|platform|tool|test/i);
  });
});

test.describe('Homepage — Footer', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('footer links are present', async ({ homePage }) => {
    await expect(homePage.footerLinks.first()).toBeVisible();
  });

  test('footer contains link to GitHub', async ({ page }) => {
    const githubFooterLink = page.locator('footer a[href*="github"]');
    await expect(githubFooterLink.first()).toBeVisible();
  });
});
