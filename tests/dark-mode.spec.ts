import { test, expect } from '../fixtures';

test.describe('Dark Mode Toggle', () => {
  test('theme toggle button is present', async ({ homePage }) => {
    await homePage.goto();
    await expect(homePage.themeToggle).toBeVisible();
  });

  test('clicking theme toggle switches to dark mode', async ({ homePage, page }) => {
    await homePage.goto();
    const htmlEl = page.locator('html');
    const before = await htmlEl.getAttribute('data-theme');
    if (before === 'dark') {
      await homePage.toggleTheme();
    }
    await homePage.toggleTheme();
    await expect(htmlEl).toHaveAttribute('data-theme', 'dark');
  });

  test('dark mode toggles back to light mode', async ({ homePage, page }) => {
    await homePage.goto();
    const htmlEl = page.locator('html');
    await homePage.toggleTheme();
    await homePage.toggleTheme();
    const attr = await htmlEl.getAttribute('data-theme');
    expect(attr).not.toBe('dark');
  });

  test('dark mode persists on page reload', async ({ homePage, page }) => {
    await homePage.goto();
    const htmlEl = page.locator('html');
    const before = await htmlEl.getAttribute('data-theme');
    if (before === 'dark') {
      await homePage.toggleTheme();
    }
    await homePage.toggleTheme();
    await expect(htmlEl).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('dark mode persists when navigating to docs', async ({ homePage, docsPage, page }) => {
    await homePage.goto();
    const before = await page.locator('html').getAttribute('data-theme');
    if (before !== 'dark') {
      await homePage.toggleTheme();
    }
    await docsPage.goto('/docs/intro');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('code blocks are readable in dark mode', async ({ homePage, docsPage }) => {
    await homePage.goto();
    await homePage.toggleTheme();
    await docsPage.goto('/docs/writing-tests');
    await expect(docsPage.codeBlocks.first()).toBeVisible();
  });

  test('theme toggle has accessible label', async ({ homePage }) => {
    await homePage.goto();
    const ariaLabel = await homePage.themeToggle.getAttribute('aria-label');
    const title = await homePage.themeToggle.getAttribute('title');
    expect(ariaLabel ?? title).toBeTruthy();
  });
});
