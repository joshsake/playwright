import { Page, Locator } from '@playwright/test';

// playwright.dev removed its /community page — community/social links now live
// in the navbar and footer, so this page object targets those on the homepage.
export class CommunityPage {
  readonly page: Page;
  readonly discordLink: Locator;
  readonly githubLink: Locator;
  readonly footerLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.discordLink = page.getByRole('link', { name: 'Discord server' });
    this.githubLink = page.getByRole('link', { name: 'GitHub repository' });
    this.footerLinks = page.locator('footer a');
  }

  async goto() {
    await this.page.goto('/');
  }

  async getSocialLinks(): Promise<Array<{ name: string | null; href: string | null }>> {
    const links = this.page.locator(
      'a[href*="discord"], a[href*="github.com/microsoft/playwright"], a[href*="stackoverflow"]'
    );
    const count = await links.count();
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push({
        name: await links.nth(i).getAttribute('aria-label') ?? await links.nth(i).textContent(),
        href: await links.nth(i).getAttribute('href'),
      });
    }
    return result;
  }
}
