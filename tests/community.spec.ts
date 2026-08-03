import { test, expect } from '../fixtures';

// playwright.dev removed its dedicated /community page (it now returns 404).
// Community entry points are the navbar/footer Discord and GitHub links.

test.describe('Community & Social Links', () => {
  test.beforeEach(async ({ communityPage }) => {
    await communityPage.goto();
  });

  test('Discord link is present in the navbar', async ({ communityPage }) => {
    await expect(communityPage.discordLink).toBeVisible();
  });

  test('Discord link points to the Discord invite', async ({ communityPage }) => {
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

  test('footer contains community links', async ({ communityPage }) => {
    await expect(communityPage.footerLinks.first()).toBeVisible();
  });
});

test.describe('Community — Removed Page', () => {
  test('old /community URL shows the 404 page', async ({ page }) => {
    await page.goto('/community');
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  });
});
