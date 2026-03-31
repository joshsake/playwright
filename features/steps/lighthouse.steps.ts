import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { test } from './fixtures';

const { Given, Then } = createBdd(test);

// Lighthouse needs its own Chrome instance with a remote debugging port.
// We launch one per scenario and store results on the fixture page for Then steps.
const LIGHTHOUSE_PORT = 9333;

Given('I run a Lighthouse audit on the homepage', async ({ page, baseURL }) => {
  const url = baseURL!;

  const browser = await chromium.launch({
    args: [`--remote-debugging-port=${LIGHTHOUSE_PORT}`],
  });

  try {
    const result = await lighthouse(url, {
      port: LIGHTHOUSE_PORT,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'best-practices', 'seo'],
    });

    (page as any).__lighthouseScores = {
      performance:      Math.round((result?.lhr.categories['performance']?.score ?? 0) * 100),
      'best-practices': Math.round((result?.lhr.categories['best-practices']?.score ?? 0) * 100),
      seo:              Math.round((result?.lhr.categories['seo']?.score ?? 0) * 100),
    };
  } finally {
    await browser.close();
  }
});

Then('the {string} score should be at least {int}', async ({ page }, category: string, threshold: number) => {
  const scores: Record<string, number> = (page as any).__lighthouseScores ?? {};
  const score = scores[category.toLowerCase()];

  expect(
    score,
    `Lighthouse "${category}" score was ${score}, expected at least ${threshold}`
  ).toBeGreaterThanOrEqual(threshold);
});
