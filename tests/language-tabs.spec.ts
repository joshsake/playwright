import { test, expect } from '../fixtures';

test.describe('Language Tabs — Homepage', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('Node.js tab is present', async ({ homePage }) => {
    await expect(homePage.nodejsTab).toBeVisible();
  });

  test('Python tab is present', async ({ homePage }) => {
    await expect(homePage.pythonTab).toBeVisible();
  });

  test('Java tab is present', async ({ homePage }) => {
    await expect(homePage.javaTab).toBeVisible();
  });

  test('.NET tab is present', async ({ homePage }) => {
    await expect(homePage.dotnetTab).toBeVisible();
  });

  test('clicking Python tab activates it', async ({ homePage }) => {
    await homePage.selectLanguageTab('Python');
    await expect(homePage.pythonTab).toHaveAttribute('aria-selected', 'true');
    await expect(homePage.nodejsTab).toHaveAttribute('aria-selected', 'false');
  });

  test('clicking Java tab activates it', async ({ homePage }) => {
    await homePage.selectLanguageTab('Java');
    await expect(homePage.javaTab).toHaveAttribute('aria-selected', 'true');
  });

  test('clicking .NET tab activates it', async ({ homePage }) => {
    await homePage.selectLanguageTab('.NET');
    await expect(homePage.dotnetTab).toHaveAttribute('aria-selected', 'true');
  });

  test('switching to Python tab updates code example', async ({ homePage, page }) => {
    await homePage.selectLanguageTab('Python');
    const codeContent = await page.locator('.tabs-container pre').first().textContent();
    expect(codeContent).toMatch(/from playwright|async_playwright|asyncio/i);
  });

  test('switching to Java tab updates code example', async ({ homePage, page }) => {
    await homePage.selectLanguageTab('Java');
    const codeContent = await page.locator('.tabs-container pre').first().textContent();
    expect(codeContent).toMatch(/import com\.microsoft\.playwright|Playwright\.create/i);
  });

  test('switching to .NET tab updates code example', async ({ homePage, page }) => {
    await homePage.selectLanguageTab('.NET');
    const codeContent = await page.locator('.tabs-container pre').first().textContent();
    expect(codeContent).toMatch(/Microsoft\.Playwright|await Playwright/i);
  });
});

test.describe('Language Tabs — Docs Pages', () => {
  test('all four language tabs render on writing-tests page', async ({ docsPage, page }) => {
    await docsPage.goto('/docs/writing-tests');
    const tabs = page.getByRole('tab');
    const tabTexts = await tabs.allTextContents();
    expect(tabTexts).toContain('Node.js');
    expect(tabTexts).toContain('Python');
    expect(tabTexts).toContain('Java');
    expect(tabTexts).toContain('.NET');
  });
});
