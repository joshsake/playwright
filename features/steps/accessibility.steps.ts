import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import AxeBuilder from '@axe-core/playwright';
import { test } from './fixtures';

const { Given, Then } = createBdd(test);

Given('I navigate to {string}', async ({ page }, path: string) => {
  await page.goto(path);
});

Then('the page should have no critical accessibility violations', async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .exclude('.DocSearch-Container') // third-party Algolia widget has known nested-interactive issue
    .analyze();

  const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');

  if (critical.length > 0) {
    const summary = critical.map(v =>
      `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} element(s))`
    ).join('\n');
    expect.soft(critical, `Accessibility violations found:\n${summary}`).toHaveLength(0);
  }

  expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
});

Then('the main navigation should be reachable by keyboard', async ({ page }) => {
  const nav = page.locator('nav').first();
  await expect(nav).toBeVisible();

  const focusableLinks = nav.locator('a[href], button');
  const count = await focusableLinks.count();
  expect(count).toBeGreaterThan(0);

  // Verify each focusable element is not explicitly removed from tab order
  for (let i = 0; i < Math.min(count, 5); i++) {
    const tabindex = await focusableLinks.nth(i).getAttribute('tabindex');
    expect(tabindex).not.toBe('-1');
  }
});

Then('all images should have alt attributes', async ({ page }) => {
  const images = page.locator('img');
  const count = await images.count();
  expect(count).toBeGreaterThan(0);

  const missing: string[] = [];
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    const src = await images.nth(i).getAttribute('src') ?? `image[${i}]`;
    if (alt === null) {
      missing.push(src);
    }
  }

  expect(missing, `Images missing alt attribute: ${missing.join(', ')}`).toHaveLength(0);
});

Then('there should be exactly one h1 heading on the page', async ({ page }) => {
  const h1Count = await page.locator('h1').count();
  expect(h1Count).toBe(1);
});
