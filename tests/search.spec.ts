import { test, expect } from '../fixtures';

test.describe('Search — Modal Behavior', () => {
  test.beforeEach(async ({ homePage, searchModal }) => {
    await homePage.goto();
    await searchModal.open();
  });

  test.afterEach(async ({ searchModal }) => {
    if (await searchModal.isOpen()) {
      await searchModal.close();
    }
  });

  test('search modal opens when search button is clicked', async ({ searchModal }) => {
    await expect(searchModal.modal).toBeVisible();
  });

  test('search input is focused when modal opens', async ({ searchModal }) => {
    await expect(searchModal.searchInput).toBeFocused();
  });

  test('modal closes on Escape key', async ({ searchModal }) => {
    await searchModal.close();
    await expect(searchModal.modal).not.toBeVisible();
  });
});

test.describe('Search — Keyboard Shortcut', () => {
  test('keyboard shortcut opens search (Ctrl+K / Cmd+K)', async ({ homePage, searchModal, page }) => {
    await homePage.goto();
    // The shortcut listener attaches after hydration, so wait for the search
    // button and retry the keypress until the modal appears.
    await searchModal.searchButton.waitFor();
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await expect(async () => {
      await page.keyboard.press(`${modifier}+k`);
      await expect(searchModal.modal).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 15_000 });
  });
});

test.describe('Search — Query Results', () => {
  test.beforeEach(async ({ homePage, searchModal }) => {
    await homePage.goto();
    await searchModal.open();
  });

  test.afterEach(async ({ searchModal }) => {
    if (await searchModal.isOpen()) {
      await searchModal.close();
    }
  });

  test('searching "locator" returns multiple results', async ({ searchModal }) => {
    await searchModal.search('locator');
    const count = await searchModal.getResultCount();
    expect(count).toBeGreaterThan(1);
  });

  test('searching "installation" returns results', async ({ searchModal }) => {
    await searchModal.search('installation');
    const count = await searchModal.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test('searching gibberish shows no results message', async ({ searchModal }) => {
    await searchModal.search('xyzzy12345notaword99');
    await expect(searchModal.noResultsMessage).toBeVisible();
  });

  test('clearing search removes results', async ({ searchModal }) => {
    await searchModal.search('locator');
    await searchModal.clearSearch();
    const afterCount = await searchModal.getResultCount();
    expect(afterCount).toBe(0);
  });
});
