import { test, expect } from '../fixtures';

test.describe('Docs — Installation Page', () => {
  test.beforeEach(async ({ docsPage }) => {
    await docsPage.goto('/docs/intro');
  });

  test('Installation heading is visible', async ({ docsPage }) => {
    await expect(docsPage.pageTitle).toContainText('Installation');
  });

  test('sidebar is visible', async ({ docsPage }) => {
    await expect(docsPage.sidebar).toBeVisible();
  });

  test('at least one code block is on the page', async ({ docsPage }) => {
    await expect(docsPage.codeBlocks.first()).toBeVisible();
  });

  test('On This Page TOC is visible with links', async ({ docsPage }) => {
    await expect(docsPage.onThisPageNav).toBeVisible();
    const count = await docsPage.onThisPageLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('breadcrumb is visible', async ({ docsPage }) => {
    await expect(docsPage.breadcrumb).toBeVisible();
  });
});

test.describe('Docs — Sidebar Navigation', () => {
  test.beforeEach(async ({ docsPage }) => {
    await docsPage.goto('/docs/intro');
  });

  test('clicking "Writing tests" navigates correctly', async ({ docsPage, page }) => {
    await docsPage.clickSidebarLink('Writing tests');
    await expect(page).toHaveURL(/writing-tests/);
    await expect(docsPage.pageTitle).toContainText('Writing tests');
  });

  test('clicking "Running tests" navigates correctly', async ({ docsPage, page }) => {
    await docsPage.clickSidebarLink('Running tests');
    await expect(page).toHaveURL(/running-tests/);
  });

  test('clicking "Debugging" navigates correctly', async ({ docsPage, page }) => {
    await docsPage.clickSidebarLink('Debugging');
    await expect(page).toHaveURL(/debug/);
  });
});

test.describe('Docs — Pagination', () => {
  test('Installation page has a Next page button', async ({ docsPage }) => {
    await docsPage.goto('/docs/intro');
    await expect(docsPage.nextPageButton).toBeVisible();
  });

  test('clicking Next navigates to the next doc page', async ({ docsPage, page }) => {
    await docsPage.goto('/docs/intro');
    const initialUrl = page.url();
    await docsPage.clickNextPage();
    expect(page.url()).not.toBe(initialUrl);
    await expect(docsPage.pageTitle).toBeVisible();
  });

  test('Writing tests page has both Previous and Next buttons', async ({ docsPage }) => {
    await docsPage.goto('/docs/writing-tests');
    await expect(docsPage.prevPageButton).toBeVisible();
    await expect(docsPage.nextPageButton).toBeVisible();
  });
});

test.describe('Docs — Code Blocks', () => {
  test.beforeEach(async ({ docsPage }) => {
    await docsPage.goto('/docs/writing-tests');
  });

  test('multiple code blocks are present on writing-tests page', async ({ docsPage }) => {
    const count = await docsPage.codeBlocks.count();
    expect(count).toBeGreaterThan(3);
  });
});
