import { Page, Locator } from '@playwright/test';

export class SearchModal {
  readonly page: Page;
  readonly searchButton: Locator;
  readonly modal: Locator;
  readonly searchInput: Locator;
  readonly resultItems: Locator;
  readonly firstResult: Locator;
  readonly noResultsMessage: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchButton = page
      .locator('button.DocSearch, button[aria-label*="Search"]')
      .first();
    this.modal = page
      .locator('.DocSearch-Modal, [class*="searchModal"]')
      .first();
    this.searchInput = page
      .locator('.DocSearch-Input, input[placeholder*="Search"]')
      .first();
    this.resultItems = page.locator('.DocSearch-Hit, [class*="searchHit"]');
    this.firstResult = this.resultItems.first();
    this.noResultsMessage = page
      .locator('.DocSearch-NoResults, [class*="noResults"]')
      .first();
    this.closeButton = page
      .locator(
        '.DocSearch-SearchBar button[aria-label*="Cancel"], button[aria-label*="Close"]'
      )
      .first();
  }

  async open() {
    await this.searchButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async close() {
    await this.page.keyboard.press('Escape');
    await this.modal.waitFor({ state: 'hidden' });
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(600);
  }

  async clearSearch() {
    await this.searchInput.clear();
  }

  async clickFirstResult() {
    await this.firstResult.click();
  }

  async getResultCount(): Promise<number> {
    return this.resultItems.count();
  }

  async isOpen(): Promise<boolean> {
    return this.modal.isVisible();
  }
}
