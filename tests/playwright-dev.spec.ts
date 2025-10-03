import { test, expect } from '@playwright/test';
import { PlaywrightDevPage } from '../pageobjects/playwright-dev';

test.describe('Playwright.dev Website', () => {
  let playwrightPage: PlaywrightDevPage;

  test.beforeEach(async ({ page }) => {
    playwrightPage = new PlaywrightDevPage(page);
    await playwrightPage.goto();
  });

  test('should have correct title', async () => {
    await playwrightPage.expectPlaywrightTitle();
  });

  test('should navigate to Get Started page', async () => {
    await playwrightPage.clickGetStarted();
    await playwrightPage.expectInstallationHeading();
    await playwrightPage.expectUrlToContain('/docs/intro');
  });

  test('should navigate to documentation sections', async () => {
    await playwrightPage.gotoDocs();
    await playwrightPage.expectSidebarToBeVisible();
    await playwrightPage.expectUrlToContain('/docs');
  });

  test('should navigate to API documentation', async () => {
    await playwrightPage.gotoAPI();
    await playwrightPage.expectUrlToContain('/docs/api');
  });

  test('should navigate to examples', async () => {
    await playwrightPage.gotoExamples();
    await playwrightPage.expectUrlToContain('/examples');
  });

  test('should navigate to blog', async () => {
    await playwrightPage.gotoBlog();
    await playwrightPage.expectUrlToContain('/blog');
  });

  test('should have working search functionality', async () => {
    await playwrightPage.search('locator');
    // Wait for search results to load
    await playwrightPage.waitForPageLoad();
    // Verify we're on a search results page
    await expect(playwrightPage.page.locator('.search-results, [data-testid="search-results"]')).toBeVisible();
  });

  test('should have accessible navigation elements', async () => {
    // Check that main navigation elements are visible
    await expect(playwrightPage.logo).toBeVisible();
    await expect(playwrightPage.getStartedLink).toBeVisible();
    await expect(playwrightPage.docsLink).toBeVisible();
  });

  test('should have social media links', async () => {
    // Scroll to footer to ensure social links are visible
    await playwrightPage.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check that social media links exist (they might open in new tabs)
    await expect(playwrightPage.githubLink).toBeVisible();
    await expect(playwrightPage.discordLink).toBeVisible();
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check if mobile menu button is visible on mobile
    await expect(playwrightPage.mobileMenuButton).toBeVisible();
    
    // Open mobile menu
    await playwrightPage.openMobileMenu();
    
    // Verify mobile menu is open (this might need adjustment based on actual implementation)
    await expect(playwrightPage.navigationMenu).toBeVisible();
  });

  test('should have code examples with copy functionality', async () => {
    await playwrightPage.clickGetStarted();
    
    // Look for code blocks on the installation page
    const codeBlocks = playwrightPage.codeBlocks;
    await expect(codeBlocks.first()).toBeVisible();
    
    // Try to copy a code block if copy button exists
    const copyButtons = playwrightPage.copyButton;
    if (await copyButtons.count() > 0) {
      await playwrightPage.copyCodeBlock(0);
      // You might want to verify clipboard content here if possible
    }
  });

  test('should have proper heading structure', async () => {
    await playwrightPage.clickGetStarted();
    
    // Verify the main heading is present
    await playwrightPage.expectHeadingToBeVisible('Installation');
    
    // Check for other common headings on the installation page
    const headings = playwrightPage.page.locator('h1, h2, h3');
    await expect(headings.first()).toBeVisible();
  });

  test('should have working sidebar navigation', async () => {
    await playwrightPage.gotoDocs();
    
    // Verify sidebar is visible
    await playwrightPage.expectSidebarToBeVisible();
    
    // Check that sidebar has links
    const sidebarLinkCount = await playwrightPage.sidebarLinks.count();
    expect(sidebarLinkCount).toBeGreaterThan(0);
    
    // Click on a sidebar link (first one)
    if (sidebarLinkCount > 0) {
      await playwrightPage.sidebarLinks.first().click();
      await playwrightPage.waitForPageLoad();
    }
  });
});
