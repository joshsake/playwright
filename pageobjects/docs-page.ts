import { Page, Locator } from '@playwright/test';

export class DocsPage {
  readonly page: Page;
  readonly sidebar: Locator;
  readonly sidebarItems: Locator;
  readonly mainContent: Locator;
  readonly pageTitle: Locator;
  readonly nextPageButton: Locator;
  readonly prevPageButton: Locator;
  readonly breadcrumb: Locator;
  readonly onThisPageNav: Locator;
  readonly onThisPageLinks: Locator;
  readonly codeBlocks: Locator;
  readonly copyCodeButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = page.locator('.theme-doc-sidebar-container');
    this.sidebarItems = page.locator('.theme-doc-sidebar-item-link');
    this.mainContent = page.locator('article');
    this.pageTitle = page.locator('article h1');
    this.nextPageButton = page.locator('.pagination-nav__link--next');
    this.prevPageButton = page.locator('.pagination-nav__link--prev');
    this.breadcrumb = page.locator('.breadcrumbs');
    this.onThisPageNav = page.locator('.table-of-contents');
    this.onThisPageLinks = page.locator('.table-of-contents a');
    this.codeBlocks = page.locator('pre');
    this.copyCodeButtons = page.locator('button[aria-label*="Copy"]');
  }

  async goto(path: string) {
    await this.page.goto(path);
  }

  async clickSidebarLink(name: string) {
    await this.sidebarItems.filter({ hasText: name }).first().click();
  }

  async clickNextPage() {
    await this.nextPageButton.click();
  }

  async clickPrevPage() {
    await this.prevPageButton.click();
  }

  async expandSidebarCategory(name: string) {
    const button = this.page
      .locator('.theme-doc-sidebar-item-category')
      .filter({ hasText: name })
      .locator('button')
      .first();
    await button.click();
  }

  async getSidebarCategoryNames(): Promise<string[]> {
    const categories = this.page.locator(
      '.theme-doc-sidebar-item-category > .menu__list-item-collapsible'
    );
    return categories.allTextContents();
  }
}
