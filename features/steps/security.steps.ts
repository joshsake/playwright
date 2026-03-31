import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { Given, Then } = createBdd(test);

Given('I navigate to the homepage', async ({ page }) => {
  await page.goto('/');
});

Given('I request the homepage', async ({ page, request, baseURL }) => {
  // Store response on page object for use in Then steps via page.evaluate workaround;
  // instead we use request context directly and stash headers in page's extra state.
  const response = await request.get(baseURL!);
  // Attach headers to page so subsequent steps can access them
  await page.goto('/');
  (page as any).__securityHeaders = response.headers();
  (page as any).__responseStatus = response.status();
});

Then('the page URL should use HTTPS', async ({ page }) => {
  expect(page.url()).toMatch(/^https:\/\//);
});

Then('the response should include a {string} header', async ({ page }, headerName: string) => {
  const headers: Record<string, string> = (page as any).__securityHeaders ?? {};
  const value = headers[headerName.toLowerCase()];
  expect(
    value,
    `Expected response to include "${headerName}" header, but it was missing.\nPresent headers: ${Object.keys(headers).join(', ')}`
  ).toBeDefined();
});

Then('the response should protect against clickjacking', async ({ page }) => {
  const headers: Record<string, string> = (page as any).__securityHeaders ?? {};
  const xFrameOptions = headers['x-frame-options'];
  const csp = headers['content-security-policy'];
  const hasFrameAncestors = csp?.includes('frame-ancestors');

  expect(
    xFrameOptions || hasFrameAncestors,
    'Expected either x-frame-options header or CSP frame-ancestors directive to be set'
  ).toBeTruthy();
});

Then('all external links should have rel="noopener"', async ({ page, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  const violations: string[] = [];

  const externalLinks = await page.locator(`a[href^="http"]:not([href^="${origin}"])`).all();

  for (const link of externalLinks) {
    const rel = await link.getAttribute('rel') ?? '';
    const href = await link.getAttribute('href') ?? '';
    if (!rel.includes('noopener')) {
      violations.push(href);
    }
  }

  expect(
    violations,
    `External links missing rel="noopener":\n${violations.join('\n')}`
  ).toHaveLength(0);
});

Then('all cookies should have the Secure flag', async ({ page }) => {
  const cookies = await page.context().cookies();
  const insecure = cookies.filter(c => !c.secure).map(c => c.name);
  expect(insecure, `Cookies missing Secure flag: ${insecure.join(', ')}`).toHaveLength(0);
});

Then('all cookies should have the SameSite attribute', async ({ page }) => {
  const cookies = await page.context().cookies();
  const missing = cookies
    .filter(c => !c.sameSite || c.sameSite === 'None')
    .map(c => c.name);
  expect(missing, `Cookies missing SameSite attribute: ${missing.join(', ')}`).toHaveLength(0);
});

Then('the script should not be executed', async ({ page }) => {
  // If XSS executed, it would trigger a dialog — verify none appeared
  let dialogFired = false;
  page.on('dialog', () => { dialogFired = true; });
  await page.waitForTimeout(500);
  expect(dialogFired).toBe(false);
});

Then('the page title should remain unchanged', async ({ page }) => {
  const title = await page.title();
  expect(title).not.toContain('<script>');
  expect(title).not.toContain('xss');
});
