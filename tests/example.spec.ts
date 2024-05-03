// https://playwright.dev/docs/getting-started-vscode
// Expects, page object calls, and any other validation belong here
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();

    // Click the get Writing tests link.
    await page.getByRole('link', { name: 'Writing tests' }).click();

    // Expects page to have a heading with the name of Writing tests.
    await expect(page.getByRole('heading', { name: 'Writing tests' })).toBeVisible();
});