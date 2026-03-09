import { Page, Locator } from '@playwright/test';

export class CommunityPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly discordLink: Locator;
  readonly githubLink: Locator;
  readonly twitterLink: Locator;
  readonly stackOverflowLink: Locator;
  readonly communityCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('h1').first();
    this.discordLink = page.getByRole('link', { name: /discord/i });
    this.githubLink = page
      .getByRole('link', { name: /github/i })
      .first();
    this.twitterLink = page.getByRole('link', { name: /twitter|x\.com/i });
    this.stackOverflowLink = page.getByRole('link', {
      name: /stack overflow/i,
    });
    this.communityCards = page.locator('.card');
  }

  async goto() {
    await this.page.goto('/community');
  }

  async getSocialLinks(): Promise<Array<{ name: string | null; href: string | null }>> {
    const links = this.page.locator(
      'main a[href*="discord"], main a[href*="github"], main a[href*="twitter"], main a[href*="stackoverflow"]'
    );
    const count = await links.count();
    const result = [];
    for (let i = 0; i < count; i++) {
      result.push({
        name: await links.nth(i).textContent(),
        href: await links.nth(i).getAttribute('href'),
      });
    }
    return result;
  }
}
