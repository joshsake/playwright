import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const bddConfig = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.ts',
  // Lighthouse runs only in the serial bdd-lighthouse project — its fixed CDP
  // port collides when scenarios run in parallel workers here.
  tags: 'not @lighthouse',
});

const bddLighthouseConfig = defineBddConfig({
  outputDir: '.features-gen-lighthouse',
  features: 'features/lighthouse.feature',
  steps: 'features/steps/*.ts',
});

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    baseURL: 'https://playwright.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/api/**', '**/mobile.spec.ts'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: ['**/api/**', '**/mobile.spec.ts'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: ['**/api/**', '**/mobile.spec.ts'],
    },
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { baseURL: 'https://jsonplaceholder.typicode.com' },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      testMatch: '**/mobile.spec.ts',
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 13'] },
      testMatch: '**/mobile.spec.ts',
    },
    {
      name: 'bdd',
      testDir: bddConfig,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'bdd-lighthouse',
      testDir: bddLighthouseConfig,
      use: { ...devices['Desktop Chrome'] },
      workers: 1, // Lighthouse uses a fixed CDP port — must run serially
    },
  ],
});
