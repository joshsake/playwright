import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly getStartedButton: Locator;
  readonly navLinks: Locator;
  readonly nodejsTab: Locator;
  readonly pythonTab: Locator;
  readonly javaTab: Locator;
  readonly dotnetTab: Locator;
  readonly featureCards: Locator;
  readonly footerLinks: Locator;
  readonly themeToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroTitle = page.locator('h1').first();
    this.heroSubtitle = page.locator('.hero__subtitle');
    this.getStartedButton = page.getByRole('link', { name: 'Get started' });
    this.navLinks = page.locator('.navbar__item');
    this.nodejsTab = page.getByRole('tab', { name: 'Node.js' });
    this.pythonTab = page.getByRole('tab', { name: 'Python' });
    this.javaTab = page.getByRole('tab', { name: 'Java' });
    this.dotnetTab = page.getByRole('tab', { name: '.NET' });
    this.featureCards = page.locator('.col--4');
    this.footerLinks = page.locator('footer a');
    this.themeToggle = page
      .locator('[class*="colorModeToggle"] button, .navbar__items--right button[title*="mode"]')
      .first();
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }

  async selectLanguageTab(lang: 'Node.js' | 'Python' | 'Java' | '.NET') {
    await this.page.getByRole('tab', { name: lang }).click();
  }

  async toggleTheme() {
    await this.themeToggle.click();
  }

  async clickNavLink(name: string) {
    await this.page.getByRole('link', { name, exact: true }).click();
  }

  async getActiveLanguageTab(): Promise<string | null> {
    return this.page
      .locator('[role="tab"][aria-selected="true"]')
      .first()
      .textContent();
  }
}
