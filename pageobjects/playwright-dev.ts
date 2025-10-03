import { Page, Locator, expect } from '@playwright/test';

export class PlaywrightDevPage {
  readonly page: Page;
  
  // Navigation elements
  readonly getStartedLink: Locator;
  readonly docsLink: Locator;
  readonly apiLink: Locator;
  readonly examplesLink: Locator;
  readonly blogLink: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  
  // Header elements
  readonly logo: Locator;
  readonly navigationMenu: Locator;
  readonly mobileMenuButton: Locator;
  
  // Main content elements
  readonly heroHeading: Locator;
  readonly heroSubheading: Locator;
  readonly installButton: Locator;
  readonly tryItButton: Locator;
  
  // Footer elements
  readonly footerLinks: Locator;
  readonly githubLink: Locator;
  readonly discordLink: Locator;
  readonly twitterLink: Locator;
  
  // Documentation elements
  readonly sidebar: Locator;
  readonly sidebarLinks: Locator;
  readonly contentArea: Locator;
  readonly tableOfContents: Locator;
  
  // Code elements
  readonly codeBlocks: Locator;
  readonly copyButton: Locator;
  readonly languageSelector: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Navigation elements
    this.getStartedLink = page.getByRole('link', { name: 'Get started' });
    this.docsLink = page.getByRole('link', { name: 'Docs' });
    this.apiLink = page.getByRole('link', { name: 'API' });
    this.examplesLink = page.getByRole('link', { name: 'Examples' });
    this.blogLink = page.getByRole('link', { name: 'Blog' });
    this.searchInput = page.getByPlaceholder('Search');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    
    // Header elements
    this.logo = page.getByRole('link', { name: 'Playwright' }).first();
    this.navigationMenu = page.locator('nav');
    this.mobileMenuButton = page.getByRole('button', { name: 'Menu' });
    
    // Main content elements
    this.heroHeading = page.getByRole('heading', { name: /Playwright/ });
    this.heroSubheading = page.locator('h2, .hero-subtitle');
    this.installButton = page.getByRole('button', { name: /Install/ });
    this.tryItButton = page.getByRole('button', { name: /Try it/ });
    
    // Footer elements
    this.footerLinks = page.locator('footer a');
    this.githubLink = page.getByRole('link', { name: 'GitHub' });
    this.discordLink = page.getByRole('link', { name: 'Discord' });
    this.twitterLink = page.getByRole('link', { name: 'Twitter' });
    
    // Documentation elements
    this.sidebar = page.locator('aside, .sidebar');
    this.sidebarLinks = page.locator('aside a, .sidebar a');
    this.contentArea = page.locator('main, .content');
    this.tableOfContents = page.locator('.toc, .table-of-contents');
    
    // Code elements
    this.codeBlocks = page.locator('pre code, .code-block');
    this.copyButton = page.getByRole('button', { name: 'Copy' });
    this.languageSelector = page.locator('.language-selector');
  }

  // Navigation methods
  async goto() {
    await this.page.goto('https://playwright.dev/');
  }

  async gotoDocs() {
    await this.docsLink.click();
  }

  async gotoAPI() {
    await this.apiLink.click();
  }

  async gotoExamples() {
    await this.examplesLink.click();
  }

  async gotoBlog() {
    await this.blogLink.click();
  }

  async clickGetStarted() {
    await this.getStartedLink.click();
  }

  // Search methods
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchInput.press('Enter');
  }

  async searchWithButton(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  // Content verification methods
  async expectTitleToContain(text: string) {
    await expect(this.page).toHaveTitle(new RegExp(text));
  }

  async expectHeadingToBeVisible(headingText: string) {
    await expect(this.page.getByRole('heading', { name: headingText })).toBeVisible();
  }

  async expectUrlToContain(path: string) {
    await expect(this.page).toHaveURL(new RegExp(path));
  }

  // Documentation navigation
  async clickSidebarLink(linkText: string) {
    await this.sidebarLinks.filter({ hasText: linkText }).click();
  }

  async expectSidebarToBeVisible() {
    await expect(this.sidebar).toBeVisible();
  }

  // Code interaction methods
  async copyCodeBlock(index: number = 0) {
    const codeBlock = this.codeBlocks.nth(index);
    const copyBtn = codeBlock.locator('..').getByRole('button', { name: 'Copy' });
    await copyBtn.click();
  }

  async selectLanguage(language: string) {
    await this.languageSelector.selectOption(language);
  }

  // Social media links
  async clickGitHubLink() {
    await this.githubLink.click();
  }

  async clickDiscordLink() {
    await this.discordLink.click();
  }

  async clickTwitterLink() {
    await this.twitterLink.click();
  }

  // Mobile navigation
  async openMobileMenu() {
    await this.mobileMenuButton.click();
  }

  // Utility methods
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  // Content verification helpers
  async expectInstallationHeading() {
    await this.expectHeadingToBeVisible('Installation');
  }

  async expectPlaywrightTitle() {
    await this.expectTitleToContain('Playwright');
  }

  // Form interaction methods (for any forms on the site)
  async fillContactForm(data: { name: string; email: string; message: string }) {
    await this.page.getByLabel('Name').fill(data.name);
    await this.page.getByLabel('Email').fill(data.email);
    await this.page.getByLabel('Message').fill(data.message);
  }

  async submitContactForm() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}
