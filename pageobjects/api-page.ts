import { Page, Locator } from '@playwright/test';

export class ApiPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly classDescription: Locator;
  readonly methodHeadings: Locator;
  readonly parameterTables: Locator;
  readonly sinceVersionBadges: Locator;
  readonly exampleCodeBlocks: Locator;
  readonly deprecatedBadges: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('article h1');
    this.classDescription = page
      .locator('article h1 + p, article h1 ~ p')
      .first();
    this.methodHeadings = page.locator('article h2, article h3');
    this.parameterTables = page.locator('article table');
    this.sinceVersionBadges = page.locator('.badge, [class*="version"]');
    this.exampleCodeBlocks = page.locator('article pre');
    this.deprecatedBadges = page.locator(
      '[class*="deprecated"], .badge--danger'
    );
  }

  async goto(className: string) {
    await this.page.goto(
      className ? `/docs/api/class-${className}` : '/docs/api/class-playwright'
    );
  }

  async getMethodNames(): Promise<string[]> {
    return this.methodHeadings.allTextContents();
  }

  async scrollToMethod(name: string) {
    const heading = this.methodHeadings.filter({ hasText: name }).first();
    await heading.scrollIntoViewIfNeeded();
  }
}
