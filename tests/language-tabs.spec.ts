import { test, expect } from '../fixtures';

// playwright.dev no longer renders language tabs on the homepage — language
// switching now happens via hero links to each language's docs and a navbar
// dropdown labeled with the current language (Node.js by default).

test.describe('Language Links — Homepage Hero', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('TypeScript link is present', async ({ homePage }) => {
    await expect(homePage.heroLanguageLink('TypeScript')).toBeVisible();
  });

  test('Python link is present and targets python docs', async ({ homePage }) => {
    const link = homePage.heroLanguageLink('Python');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/python\/docs\/intro/);
  });

  test('Java link is present and targets java docs', async ({ homePage }) => {
    const link = homePage.heroLanguageLink('Java');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/java\/docs\/intro/);
  });

  test('.NET link is present and targets dotnet docs', async ({ homePage }) => {
    const link = homePage.heroLanguageLink('.NET');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/dotnet\/docs\/intro/);
  });
});

test.describe('Language Switcher — Navbar', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('language dropdown shows the current language', async ({ homePage }) => {
    await expect(homePage.languageDropdown).toBeVisible();
    await expect(homePage.languageDropdown).toHaveText(/Node\.js/);
  });

  test('language dropdown exposes the other languages', async ({ homePage, page }) => {
    await homePage.languageDropdown.click();
    const menu = page.locator('.navbar .dropdown__menu, .navbar [role="menu"]').first();
    await expect(menu.getByRole('link', { name: 'Python' })).toBeVisible();
    await expect(menu.getByRole('link', { name: 'Java' })).toBeVisible();
    await expect(menu.getByRole('link', { name: '.NET' })).toBeVisible();
  });
});

test.describe('Language Docs — Python variant', () => {
  test('python docs pages serve python code samples', async ({ page }) => {
    await page.goto('/python/docs/intro');
    const code = page.locator('article pre').first();
    await expect(code).toBeVisible();
    await expect(page.locator('article')).toContainText(/pytest|pip install/i);
  });
});
