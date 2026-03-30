import { test, expect } from '../fixtures';

test.describe('Community Page', () => {
  test.beforeEach(async ({ communityPage }) => {
    await communityPage.goto();
  });

  test('community page title is visible', async ({ communityPage }) => {
    await expect(communityPage.pageTitle).toBeVisible();
  });

  test('Discord link is present', async ({ communityPage }) => {
    await expect(communityPage.discordLink).toBeVisible();
  });

  test('Discord link has discord.com href', async ({ communityPage }) => {
    await expect(communityPage.discordLink).toHaveAttribute('href', /discord/);
  });

  test('GitHub link points to microsoft/playwright', async ({ communityPage }) => {
    await expect(communityPage.githubLink).toHaveAttribute(
      'href',
      /github\.com\/microsoft\/playwright/
    );
  });

  test('social links collection is not empty', async ({ communityPage }) => {
    const links = await communityPage.getSocialLinks();
    expect(links.length).toBeGreaterThan(0);
  });

  test('community cards are visible', async ({ communityPage }) => {
    const count = await communityPage.communityCards.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Community — Navigation from Homepage', () => {
  test('clicking Community nav link reaches community page', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.clickNavLink('Community');
    await expect(page).toHaveURL(/community/);
  });
});
