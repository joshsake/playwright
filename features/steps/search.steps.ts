import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from './fixtures';

const { When, Then } = createBdd(test);

When('I open the search modal', async ({ searchModal }) => {
  await searchModal.open();
});

When('I close the search modal', async ({ searchModal }) => {
  await searchModal.close();
});

Then('the search modal should be visible', async ({ searchModal }) => {
  expect(await searchModal.isOpen()).toBe(true);
});

Then('the search modal should not be visible', async ({ searchModal }) => {
  expect(await searchModal.isOpen()).toBe(false);
});

When('I search for {string}', async ({ searchModal }, query: string) => {
  await searchModal.search(query);
});

Then('I should see search results', async ({ searchModal }) => {
  const count = await searchModal.getResultCount();
  expect(count).toBeGreaterThan(0);
});

Then('I should see no results', async ({ searchModal }) => {
  await expect(searchModal.noResultsMessage).toBeVisible();
});
