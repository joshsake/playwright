import { test, expect } from '../fixtures';

test.describe('API Reference — Playwright Class', () => {
  test.beforeEach(async ({ apiPage }) => {
    await apiPage.goto('');
  });

  test('Playwright class page heading is visible', async ({ apiPage }) => {
    await expect(apiPage.pageTitle).toBeVisible();
    await expect(apiPage.pageTitle).toContainText('Playwright');
  });

  test('methods list is not empty', async ({ apiPage }) => {
    const methods = await apiPage.getMethodNames();
    expect(methods.length).toBeGreaterThan(0);
  });

  test('example code blocks are present', async ({ apiPage }) => {
    await expect(apiPage.exampleCodeBlocks.first()).toBeVisible();
  });
});

test.describe('API Reference — Page Class', () => {
  test.beforeEach(async ({ apiPage }) => {
    await apiPage.goto('page');
  });

  test('Page class page renders correctly', async ({ apiPage }) => {
    await expect(apiPage.pageTitle).toContainText('Page');
  });

  test('page.goto method is documented', async ({ apiPage, page }) => {
    await apiPage.scrollToMethod('page.goto');
    const heading = page
      .locator('article h2, article h3')
      .filter({ hasText: 'page.goto' });
    await expect(heading.first()).toBeVisible();
  });

  test('page.click or page.locator method is documented', async ({ page }) => {
    const heading = page
      .locator('article h2, article h3')
      .filter({ hasText: /page\.click|page\.locator/i });
    await expect(heading.first()).toBeVisible();
  });

  test('example code blocks are present', async ({ apiPage }) => {
    const count = await apiPage.exampleCodeBlocks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('API Reference — Locator Class', () => {
  test.beforeEach(async ({ apiPage }) => {
    await apiPage.goto('locator');
  });

  test('Locator class page renders', async ({ apiPage }) => {
    await expect(apiPage.pageTitle).toContainText('Locator');
  });

  test('locator.click method is documented', async ({ apiPage, page }) => {
    await apiPage.scrollToMethod('locator.click');
    const heading = page
      .locator('article h2, article h3')
      .filter({ hasText: 'locator.click' });
    await expect(heading.first()).toBeVisible();
  });

  test('locator.fill method is documented', async ({ page }) => {
    const heading = page
      .locator('article h2, article h3')
      .filter({ hasText: 'locator.fill' });
    await expect(heading.first()).toBeVisible();
  });
});

test.describe('API Reference — BrowserContext Class', () => {
  test.beforeEach(async ({ apiPage }) => {
    await apiPage.goto('browsercontext');
  });

  test('BrowserContext class page renders', async ({ apiPage }) => {
    await expect(apiPage.pageTitle).toContainText('BrowserContext');
  });

  test('methods are documented', async ({ apiPage }) => {
    const methods = await apiPage.getMethodNames();
    expect(methods.length).toBeGreaterThan(0);
  });
});
