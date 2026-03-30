import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Given, When, Then } = createBdd(test);

Given('I am on the Playwright homepage', async ({ homePage }) => {
  await homePage.goto();
});

Given('I am on the writing tests docs page', async ({ page }) => {
  await page.goto('/docs/writing-tests');
});

Then('I should see the hero title', async ({ homePage }) => {
  await expect(homePage.heroTitle).toBeVisible();
});

Then('I should see the {string} button', async ({ homePage }, _buttonName: string) => {
  await expect(homePage.getStartedButton).toBeVisible();
});

When('I click the {string} button', async ({ homePage }, _buttonName: string) => {
  await homePage.clickGetStarted();
});

Then('I should be on a docs page', async ({ page }) => {
  await expect(page).toHaveURL(/\/docs\//);
});

When('I select the {string} language tab', async ({ homePage }, language: string) => {
  await homePage.selectLanguageTab(language as 'Node.js' | 'Python' | 'Java' | '.NET');
});

Then('the {string} tab should be active', async ({ page }, language: string) => {
  const activeTab = page.getByRole('tab', { name: language, selected: true });
  await expect(activeTab).toBeVisible();
});

Then('I should see footer links', async ({ homePage }) => {
  await expect(homePage.footerLinks.first()).toBeVisible();
});
