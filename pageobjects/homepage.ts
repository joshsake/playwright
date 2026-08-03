import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly getStartedButton: Locator;
  readonly navLinks: Locator;
  readonly languageDropdown: Locator;
  readonly heroLanguageLinks: Locator;
  readonly featureCards: Locator;
  readonly footerLinks: Locator;
  readonly themeToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroTitle = page.locator('h1').first();
    this.heroSubtitle = page.locator('.hero__subtitle');
    this.getStartedButton = page.getByRole('link', { name: 'Get started' });
    this.navLinks = page.locator('.navbar__item');
    // The navbar language switcher is a dropdown button labeled with the current language
    this.languageDropdown = page.locator('.navbar').getByRole('button', { name: 'Node.js' });
    // The hero paragraph links out to each language's docs
    this.heroLanguageLinks = page.locator('header a[href*="docs/intro"]');
    this.featureCards = page.locator('.col--4');
    this.footerLinks = page.locator('footer a');
    this.themeToggle = page.getByRole('button', { name: /dark and light mode/i });
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickGetStarted() {
    await this.getStartedButton.click();
  }

  heroLanguageLink(lang: 'TypeScript' | 'Python' | 'Java' | '.NET'): Locator {
    return this.page.locator('header').getByRole('link', { name: lang, exact: true });
  }

  // The theme button cycles system -> light -> dark, so click until we land on the target
  async setTheme(theme: 'light' | 'dark') {
    const htmlEl = this.page.locator('html');
    for (let i = 0; i < 3; i++) {
      if ((await htmlEl.getAttribute('data-theme')) === theme) return;
      await this.themeToggle.click();
      await this.page.waitForTimeout(200);
    }
  }

  async clickNavLink(name: string) {
    await this.page.getByRole('link', { name, exact: true }).click();
  }
}
